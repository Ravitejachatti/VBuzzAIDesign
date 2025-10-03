import React from 'react';
import HomeHero from '../components/NormalPages/Home/HomeHero';
import Events from '../components/NormalPages/Home/Events';
import Services from '../components/NormalPages/Home/Services';
import OurMission from '../components/NormalPages/Home/OurMission';
import OurApproach from '../components/NormalPages/Home/OurApproach';
import OurPartners from '../components/NormalPages/Home/Our Partners';
import Testimonial from '../components/NormalPages/Home/Testimonial'

const Home = () => {
    return (
        <div>
            <HomeHero/>
            <Events />
            <Services />
            <OurMission />
            <OurApproach />
            <OurPartners />
            <Testimonial />
        </div>
    );
};

export default Home;