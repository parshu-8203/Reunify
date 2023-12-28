import "./index.css"
import React, { useState, useRef } from "react";
import axios from 'axios';
import upload from "../../upload.png"
import Notification from '../../widgets/Notification';
const Report = () => {
    const inputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [hasUploadedImage, setHasUploadedImage] = useState(false);
    const [notification, setNotification] = useState(null);
    const [backgroundDimmed, setBackgroundDimmed] = useState(false)
    const closeNotification = () => {
        setNotification(null);
        setBackgroundDimmed(false);
    };
    const handleImageChange = (e) => {
        const selectedImage = e.target.files && e.target.files[0];

        console.log('Selected Image:', selectedImage);

        if (selectedImage) {
            setImage(URL.createObjectURL(selectedImage));
            console.log('Image URL:', URL.createObjectURL(selectedImage));
            setHasUploadedImage(true);
        }
    };
    const handleRemoveImage = () => {
        setImage(null);
        setHasUploadedImage(false);
    };
    const handleImageClick = () => {
        inputRef.current.click();
    };
    const handleClick = (e) => {

        e.preventDefault();
        const formData = new FormData();
        if (image) {
            // Convert the image URL to bytes and append it to the FormData
            fetch(image)
                .then((response) => response.blob()) // Use response.blob() to get binary data
                .then((imageBlob) => {
                    formData.append('image', imageBlob, 'user_image.jpg')

                    axios
                        .post('http://localhost:5000/report_missing_person', formData)
                        .then((response) => {
                            if(response.data.error){
                                alert(response.data.error);
                            }
                            if (response.data.matchingRecord) {
                                const matchingRecord = response.data.matchingRecord;
                                // Display matching image and details in the notification
                                const notificationContent = (
                                    <div>
                                        {/* Display the base64-encoded image */}
                                        <div className='uploaded-image-container'>
                                            <img src={`data:image/jpeg;base64, ${matchingRecord.image_data}`} alt="Matching User" />
                                        </div>
                                        <p>Name: {matchingRecord.name}</p>
                                        <p>Age: {matchingRecord.age}</p>
                                        <p>contact number: {matchingRecord.contact_number}</p>
                                        <hr />
                                        <p>Uploader: {matchingRecord.uploader_name}</p>
                                        {/* <p>Uploader Contact: {matchingRecord.uploader_number}</p> */}
                                    </div>
                                );
                                setNotification(notificationContent);
                                setBackgroundDimmed(true);
                                setImage(null);
                                setHasUploadedImage(false);
                            }
                        })
                }
                )
        }
    };
    return (
        <div className="con">
            <form onSubmit={handleClick}>
                <div className="image-sec">
                    <h2>Upload Image</h2>
                    <div onClick={handleImageClick}>
                        {image ? <><img className='uploaded-image-container' src={image} alt='uploaded successfully' /> </> : <img src={upload} style={{ marginLeft: "15px" }} width="150px" alt='upload image' />}
                        {/* Hidden file input */}
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            ref={inputRef}
                            onChange={handleImageChange}
                            name="image"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <button type="submit" style={{ marginLeft: "10px", width: "80%" }}>Find</button>
                {notification && (
                    <Notification content={notification} closeNotification={closeNotification} />
                )}
            </form>
        </div>
    );
}
export default Report;