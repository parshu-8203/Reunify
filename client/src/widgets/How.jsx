// HowItWorks.js

import React from 'react';
import './How.css'; // Import your CSS file

const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            title: 'Navigate to the Search Page',
            content: 'Click on the "Search" option in the navigation bar.',
        },
        {
            number: 2,
            title: 'Register a Missing Person',
            content: 'Fill in details such as the persons name, age, gender, address, and upload a clear image.Click "Submit" to register the case.',
        },
        // ... Repeat similar structures for other steps ...
        {
            number: 3,
            title: 'Confirmation and Follow-Up',
            content: 'Receive a confirmation message after successfully registering the missing person case.Follow up with any additional information or updates if needed.',
        },
        {
            number: 4,
            title: 'Get Involved:',
            content: 'Share our website on social media to increase awareness and broaden our search efforts.',
        },
    ];
    const step = [
        {
            number: 1,
            title: 'Navigate to Report Page',            
            content: 'If you have information on a missing person, click on the "Report option in the navigation bar',
        },
        {
            number: 2,
            title: 'Upload Image:',
            content: 'Provide a clear image of the person you believe matches a missing individual.',
        },
        // ... Repeat similar structures for other steps ...
        {
            number: 3,
            title: 'Initiate Face Recognition:',
            content: 'Click on the "Find" button to initiate the face recognition process.',
        },
        {
            number: 4,
            title: 'Report a Match:',
            content: 'If you recognize a person in the matching results, follow the provided instructions to report the match.',
        },
        {
            number : 5,
            title : "Confirmation and Contact Details",
            content : "Receive a confirmation message for successfully reporting a match.If a match is confirmed, you will receive contact details to communicate with the relevant authorities or parties."
        },
        {
            number: 6,
            title: 'Get Involved:',
            content: 'Share the success story on social media to inspire others and contribute to our collective effort.',
        },
    ];

    return (
        <div className="how-it-works-container">
            <center><h2>How It Works</h2></center>
            <h3>Registering a Missing Person</h3>
            <div className="steps-container">
                {steps.map((step) => (
                    <div key={step.number} className={`step ${step.number % 2 === 0 ? 'even' : 'odd'}`}>
                        <div className="step-number">{step.number}</div>
                        <div>
                            <h3>{step.title}</h3>
                            <p>{step.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <h3>Reporting a Match</h3>
            <div className="steps-container">
                {step.map((step) => (
                    <div key={step.number} className={`step ${step.number % 2 == 0 ? 'even' : 'odd'}`}>
                        <div className="step-number">{step.number}</div>
                        <div>
                            <h3>{step.title}</h3>
                            <p>{step.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
