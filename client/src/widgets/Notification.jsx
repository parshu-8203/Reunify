// Notification.js
import React from 'react';
import './Notification.css'
const Notification = ({ content, closeNotification }) => {
  return (
    <div className="notification">
      <div className="notification-content">
        {content}
      </div>
      <button onClick={closeNotification}>Close</button>
    </div>
  );
};

export default Notification;
