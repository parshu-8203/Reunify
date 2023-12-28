import React, { useState, useRef } from 'react';
import './index.css';
import axios from 'axios';
import Notification from '../../widgets/Notification';
import upload from "../../upload.png"
const Search = ({ userId }) => {
  const [image, setImage] = useState(null);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const inputRef = useRef(null);
  const closeNotification = () => {
    setNotification(null);
    setBackgroundDimmed(false);
  };
  const [notification, setNotification] = useState(null);
  const [backgroundDimmed, setBackgroundDimmed] = useState(false)
  const [details, setDetails] = useState({
    name: '',
    age: '',
    gender: '',
    contactNumber: '',
    Address: '',

  });

  const handleImageChange = (e) => {
    const selectedImage = e.target.files && e.target.files[0];

    console.log('Selected Image:', selectedImage);

    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
      console.log('Image URL:', URL.createObjectURL(selectedImage));
      setHasUploadedImage(true);
    }
  };


  const handleDetailsChange = (e) => {
    const { name, value, type } = e.target;

    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'radio' ? e.target.value : value,
    }));
  };
  const handleRemoveImage = () => {
    setImage(null);
    setHasUploadedImage(false);
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFindClick = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const user_id = userId;
    // Append the data to the FormData object
    formData.append('name', details.name);
    formData.append('age', details.age);
    formData.append('gender', details.gender);
    formData.append('Address', details.Address);
    formData.append('contact_number', details.contactNumber);
    formData.append('user_id', user_id); //replace this id with actual id

    // Check if there's a file selecteds
    if (image) {
      // Convert the image URL to bytes and append it to the FormData
      fetch(image)
        .then((response) => response.blob()) // Use response.blob() to get binary data
        .then((imageBlob) => {
          formData.append('image', imageBlob, 'user_image.jpg');

          // Send the data to the /report_missing_person route using Axios
          axios
            .post('http://localhost:5000/search_missing_person', formData)
            .then((response) => {
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
                setDetails({
                  name: '',
                  age: '',
                  gender: '',
                  contactNumber: '',
                  Address: '',
                });
                setImage(null);
                setHasUploadedImage(false);
              } else {
                if (response.data.error) {
                  setNotification("Face Not Found")
                }
                else {
                  // Display a success message in the notification
                  setNotification('Reported case successfully.');
                  setDetails({
                    name: '',
                    age: '',
                    gender: '',
                    contactNumber: '',
                    Address: '',
                  });
                  setImage(null);
                  setHasUploadedImage(false);
                }
              }
            })
            .catch((error) => {
              // Handle any errors when fetching the image
              console.error('Error fetching image:', error);
            });
        })
    }
    else {
      // If there's no image, log an error or provide user feedback
      console.error('No image selected');
    }
  };


  return (
    <>
      <form onSubmit={handleFindClick}>
        <div className="profile-page">
          {backgroundDimmed && <div className="dim-background"></div>}
          <div className="image-section">
            <h2>Upload Image</h2>
            <div onClick={handleImageClick}>
              {image ? <><img className='uploaded-image-container' src={image} alt='uploaded successfully' /> <button onClick={() => handleRemoveImage()}>Remove</button></> : <img src={upload} width="150px"alt='upload image' />}
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


            {/* {hasUploadedImage ? (
              <div className="uploaded-image-container">
                <img src={image} alt="User" />
                <button onClick={() => handleRemoveImage()}>Remove</button>
              </div>
            ) : null} */}


          </div>
          <div className="details-section">
            <h2 id="coll" style={{ color: "white" }}>Details</h2>
            <div className="form-group">
              <label >Name</label>
              <input
                type="text"
                name="name"
                required
                value={details.name}
                onChange={handleDetailsChange}
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                required
                value={details.age}
                onChange={handleDetailsChange}
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                required
                value={details.contactNumber}
                onChange={handleDetailsChange}
              />
            </div>
            <div className='form-group'>
              <label>Gender</label>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={details.gender === 'male'}
                onChange={handleDetailsChange}
              />
              <label htmlFor="male">Male</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={details.gender === 'female'}
                onChange={handleDetailsChange}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="form-group">
              <label >Address</label>
              <textarea
                name="Address"
                value={details.Address}
                onChange={handleDetailsChange}
              ></textarea>
            </div>
            <center>
              <button type="submit" onClick={handleFindClick}>Find</button>
            </center>

          </div>

          {notification && (
            <Notification content={notification} closeNotification={closeNotification} />
          )}
        </div>
      </form>
    </>
  );
}

export default Search;