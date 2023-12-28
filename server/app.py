from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId 
import base64
import io
from PIL import Image
import face_recognition
import numpy as np
from dotenv import load_dotenv
import os
load_dotenv()
app = Flask(__name__)
CORS(app)
user_schema = {
    "email": str,
    "password": str,
    "mobile": str,
    "name": str
}


reported_image_schema = {
    "user_id": ObjectId,
    "image_data": bytes,  # For binary data
    "name": str,
    "age": int,
    "gender": str,
    "contact_number": str,
    "Address": str,
    "is_reported": bool
}

def connect_to_mongodb():
    try:
        MONGO_URI = os.environ.get('DATABASE_URL')
        client = MongoClient(MONGO_URI)
        db = client.get_database("reunifyDB")

        return db
    except ConnectionFailure as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        return None

def validate_user_data(user_data):
    for field, data_type in user_schema.items():
        if field not in user_data:
            return False
        if not isinstance(user_data[field], data_type):
            return False
    return True

mongodb_connection = connect_to_mongodb()

users = mongodb_connection["users"]
reported_images = mongodb_connection["cases"]

def run_frs(image_data):
    try:
        input_image = Image.open(io.BytesIO(image_data))
        input_image_np = np.array(input_image)
        encoding1 = face_recognition.face_encodings(input_image_np)
        if not encoding1:
            return {"error": "Face not found"}
        else:
            all_records = reported_images.find()
            for record in all_records:
                stored_image_data = record["image_data"]
                stored_image = Image.open(io.BytesIO(stored_image_data))
                stored_image_np = np.array(stored_image)
                encoding2 = face_recognition.face_encodings(stored_image_np)
                for x in encoding1:
                    for y in encoding2: 
                        face_distance = face_recognition.face_distance(
                            [x], y
                        )
                        threshold = 0.6
                        if face_distance < threshold:
                            return record
        return None
    except:
        return {"error": "Face not found"}
                



    


@app.route('/')
def index():
    if mongodb_connection is not None:
        return "Connected to MongoDB"
    else:
        return "Failed to connect to MongoDB"



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if data:
        existing_user = users.find_one({"email": data["email"]})
        if existing_user:
            return jsonify({"message": "Email already registered, Please Login!!!"})

      
        user_id = users.insert_one(data).inserted_id
        return jsonify({"message": "User created successfully, Please Login!!", "user_id": str(user_id)})
    else:
        return jsonify({"message": "Invalid user data"})

@app.route('/login', methods=['POST'])
def login():
    login_data = request.json

    if "email" in login_data and "password" in login_data:
       
        user = users.find_one({"email": login_data["email"]})

        if user and user["password"] == login_data["password"]:
           
            return jsonify({"message": "Login successful", "user_id": str(user["_id"])})
    
    return jsonify({"error": "Invalid login credentials"})

@app.route('/report_missing_person', methods=['POST'])
def report_missing_person():
    data = request.form

 # Get user_id from the token

    if "image" in request.files:  #and "name" in data and "age" in data and "gender" in data
        uploaded_image = request.files["image"]
        image_data = uploaded_image.read()  # Read binary data

        matching_record = run_frs(image_data)  # Pass image_data to the run_frs function
        if matching_record and "error" in matching_record:
            return jsonify({"error": matching_record["error"]})
        if matching_record:
    # Convert bytes to base64 encoded string
            uploader = users.find_one({'_id': ObjectId(matching_record["user_id"])})
            if uploader:
                image_data_base64 = base64.b64encode(matching_record["image_data"]).decode('utf-8')
                matching_record["image_data"] = image_data_base64
                # matching_record["_id"] = str(matching_record["_id"])  # Convert ObjectId to string
                matching_record["uploader_name"] = uploader["name"]
                # matching_record["uploader_number"] = uploader["mobile"]
            else:
                # Handle the case where the uploader is not found
                matching_record["uploader_name"] = "Uploader not found"
                matching_record["uploader_number"] = "N/A"
            # image_data_base64 = base64.b64encode(image_data).decode('utf-8')

            # # Modify the matching_record dictionary:
            # matching_record["image_data"] = image_data_base64

            # Additional modification for non-serializable data (if needed)
            matching_record["_id"] = str(matching_record["_id"])
            matching_record["user_id"] = str(matching_record["user_id"])
            return jsonify({"message": "Match found for reported case", "matchingRecord": (matching_record)})
        else:
            return jsonify({"error":"Match not Found, Please Reigster the case in search page"})
    return jsonify({"error":"invalid data"})
@app.route('/search_missing_person', methods=['POST'])
def search_missing_person():
    data = request.form

 # Get user_id from the token

    if "image" in request.files:  #and "name" in data and "age" in data and "gender" in data
        uploaded_image = request.files["image"]
        image_data = uploaded_image.read()  # Read binary data

        matching_record = run_frs(image_data)  # Pass image_data to the run_frs function
        if matching_record and "error" in matching_record:
            return jsonify({"error": matching_record["error"]})
        if matching_record:
    # Convert bytes to base64 encoded string
            uploader = users.find_one({'_id': ObjectId(matching_record["user_id"])})
            if uploader:
                image_data_base64 = base64.b64encode(matching_record["image_data"]).decode('utf-8')
                matching_record["image_data"] = image_data_base64
                # matching_record["_id"] = str(matching_record["_id"])  # Convert ObjectId to string
                matching_record["uploader_name"] = uploader["name"]
                # matching_record["uploader_number"] = uploader["mobile"]
            else:
                # Handle the case where the uploader is not found
                matching_record["uploader_name"] = "Uploader not found"
                matching_record["uploader_number"] = "N/A"
            # image_data_base64 = base64.b64encode(image_data).decode('utf-8')

            # # Modify the matching_record dictionary:
            # matching_record["image_data"] = image_data_base64

            # Additional modification for non-serializable data (if needed)
            matching_record["_id"] = str(matching_record["_id"])
            matching_record["user_id"] = str(matching_record["user_id"])
            return jsonify({"message": "Match found for reported case", "matchingRecord": (matching_record)})
        data_to_insert = {
            "user_id": data["user_id"],
            "image_data": image_data,  # Store the binary image data
            "name": data["name"],
            "age": int(data["age"]),
            "gender": data["gender"],
            "contact_number": data.get("contact_number", ""),
            "Address": data.get("Address", ""),
            "is_reported": matching_record is not None
        }

        result = reported_images.insert_one(data_to_insert)
        inserted_id = result.inserted_id


        return jsonify({"message": "Reported case stored successfully", "inserted_record_id": str(inserted_id)})

    return jsonify({"error": "Invalid reported case data"})

if __name__ == '__main__':
    app.run(debug=True)
