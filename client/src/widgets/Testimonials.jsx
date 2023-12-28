import React, { useState } from 'react';
import './Testimonials.css';

const testimonialsData = [
    {
        id: 1,
        name: 'John Doe',
        position: 'Volunteer',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        id: 2,
        name: 'Jane Smith',
        position: 'Supporter',
        comment: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    // Add more testimonials as needed
];

const TestimonialsCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1));
    };

    return (
        <>
        <center><h2>Testimonials</h2></center>
        <div className="testimonials-carousel-container">
            <div className="testimonial">
                <p className="comment">{testimonialsData[activeIndex].comment}</p>
                <div className="author">
                    <p className="name">{testimonialsData[activeIndex].name}</p>
                </div>
            </div>
            <div className="carousel-navigation">
                <button className="button" onClick={handlePrev}>&#8249;</button>
                <button className="button" onClick={handleNext}>&#8250;</button>
            </div>
        </div>
        </>
    );

};

export default TestimonialsCarousel;
