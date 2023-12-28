import "./index.css";
import HowItWorks from "../../widgets/How";
import bg from "../../bg.jpg"
import TestimonialsCarousel from "../../widgets/Testimonials";
const Home = () => {
    return (
        <>
            <div id="image-container">
                <img src={bg} alt="Full-width image" />
                <div id="image-overlay">
                    <h1> Bringing Families Back Together:
                        Join Us in the Search for Missing Loved Ones</h1>
                    <a href="/search" class="button-90">Search</a>
                </div>
            </div>
            <HowItWorks/>
            <TestimonialsCarousel/>
        </>
    )
}

export default Home;