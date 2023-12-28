// AuthForm.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './index.css'
import pic from "../../pic.jpg";
import axios from 'axios';
import iconImage from "../../parents.png"
const AuthForm = ({onLogin}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        // Common data for both login and register
        const commonData = {
            email,
            password,
        };

        if (isLogin) {
            // Handle login logic
            try {
                const response =  await axios.post('http://localhost:5000/login', commonData);
 
                console.log('Login response:', response);
                if(response.data.error){
                    alert(response.data.error);
                }
                else{
                    alert(response.data.message);
                    
                    setRedirect(true);
                    onLogin(response.data.user_id);
                    // onLogin();
                }
                // Handle successful login
            } catch (error) {
                console.error('Login error:', error);
                // Handle login error
            }
        } else {
            // Handle register logic
            const confirmPassword = e.target.elements.confirmPassword.value;
            if (password === confirmPassword) {

                const contact = e.target.elements.contact.value;
                const name = e.target.elements.name.value;

                const registerData = {
                    ...commonData,
                    name,
                    contact,
                };

                try {
                    const response =  await axios.post('http://localhost:5000/signup', registerData)
                   
                    alert(response.data.message);
                    console.log('Register response:', response);
                    // Handle successful registration
                } catch (error) {
                    console.error('Register error:', error);

                    // Handle registration error
                }
            }
            else {
                alert("Password didn't match");
            }
        }
    };
    if(redirect) {
       
        return(
             <Navigate to="/home"  />
             )
             ;
    }
    return (
        <div className="container">
            <div className="form-box">
                <div className="header">
                    <img src={iconImage} alt="Icon" className="icon" />
                    <h2 style={{ fontSize: "2.5rem" }}>REUNIFY</h2>
                </div>
                <h3>{isLogin ? 'Login' : 'Register'}</h3>
                <form onSubmit={handleSubmit}>
                    {/* Common form fields */}
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" required />

                    {/* Additional fields for registration */}
                    {!isLogin && (
                        <>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password" id="confirmPassword" required />
                            <label htmlFor="name">Full Name:</label>
                            <input type="text" id="name" required />
                            <label htmlFor="contact">Contact Number:</label>
                            <input type="tel" id="contact" required />
                        </>
                    )}

                    <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                </form>

                <p onClick={toggleForm} style={{ fontWeight: 200, cursor: 'pointer' }}>
                    {isLogin ? 'Don\'t have an account? Register here.' : 'Already have an account? Login here.'}
                </p>
            </div>
            <div className="image-box">
                <img src={pic} alt="Auth Image" />
            </div>
        </div>
    );
};

export default AuthForm;
