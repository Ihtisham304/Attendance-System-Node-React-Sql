import React from 'react'
import { useState,useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const EditProfilePicture = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');

    const token = localStorage.getItem('token');

    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;
  
    useEffect(() => {
      const fetchProfilePicture = async () => {
        try {
         
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile-picture/${user_id}`
        //     , {
        //     headers: {
        //       'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        //   }
        );
          setProfilePicture(response.data.profilePicture);
          console.log(response.data.profilePicture);
          console.log(profilePicture);

        } catch (error) {
          console.error('Error fetching profile picture', error);
        }
      };
  
      fetchProfilePicture();
    }, [user_id,token]);
  
    // Handle file selection
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
  
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('profile_picture', selectedFile);
  
      try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/edit/picture/${user_id}`, formData);
  
        // Update the displayed profile picture
        setProfilePicture(response.data.profilePicture);
        console.log(response.data.profilePicture);
        alert('Profile picture updated successfully');
      } catch (error) {
        console.error('Error updating profile picture', error);
      }
    };
  
    return (
      <>
        <h3>Profile Picture</h3>
        <div>
          <img 
            src={preview || `${import.meta.env.VITE_BASE_IMG}/images/${profilePicture}`} 
            alt="user_profile" 
            style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label>Change Picture</label>
          <input type="file" onChange={handleFileChange} required />
          <button type="submit">Change</button>
        </form>
      </>
    );
}

export default EditProfilePicture