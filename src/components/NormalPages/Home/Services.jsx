import React from "react";
import ServiceCard from "../../Resuable/cards/ServiceCard";
import Button from "../../Resuable/Button";

import service from "../../../assets/service.png";
import serviceicon from "../../../assets/serviceicon.png";


const servicesList = [
    {
        id: 1,
        image: service,
        icon: serviceicon,
        title: "Virtual Mock Interviews",
        description: "Practice with industry experts and get personalized feedback to improve your interview skills.",
        features: [
            {
                feature: "One-on-one sessions with corporate experts"
            },
            {
                feature: "Industry-specific interview preparation"
            },
            {
                feature: "Detailed feedback and improvement areas"
            },
            {
                feature: "Interview recordings for self-review"
            },
        ],
    },
    {
        id: 2,
        image: service,
        icon: serviceicon,
        title: "Virtual Mock Interviews",
        description: "Practice with industry experts and get personalized feedback to improve your interview skills.",
        features: [
            {
                feature: "One-on-one sessions with corporate experts"
            },
            {
                feature: "Industry-specific interview preparation"
            },
            {
                feature: "Detailed feedback and improvement areas"
            },
            {
                feature: "Interview recordings for self-review"
            },
        ],
    },
    {
        id: 3,
        image: service,
        icon: serviceicon,
        title: "Virtual Mock Interviews",
        description: "Practice with industry experts and get personalized feedback to improve your interview skills.",
        features: [
            {
                feature: "One-on-one sessions with corporate experts"
            },
            {
                feature: "Industry-specific interview preparation"
            },
            {
                feature: "Detailed feedback and improvement areas"
            },
            {
                feature: "Interview recordings for self-review"
            },
        ],
    },
    {
        id: 4,
        image: service,
        icon: serviceicon,
        title: "Virtual Mock Interviews",
        description: "Practice with industry experts and get personalized feedback to improve your interview skills.",
        features: [
            {
                feature: "One-on-one sessions with corporate experts"
            },
            {
                feature: "Industry-specific interview preparation"
            },
            {
                feature: "Detailed feedback and improvement areas"
            },
            {
                feature: "Interview recordings for self-review"
            },
        ],
    },
]

const Services = () => {
  return (
    <section className="bg-primary/10 font-poppins px-[50px] sm:px-8 md:px-[150px] py-12 md:py-20 md:mt-[100px] sm:mt-[50px] sm:px-[50px] items-center justify-center">
      <div className="max-w-7xl mx-auto flex flex-col items-left md:text-center">
        <div className="flex items-center gap-2 md:justify-center">
          <div className="w-[15px] h-[2px] bg-secondary"></div>
          <h6 className="text-[16px] font-semibold text-black">OUR SERVICES</h6>
        </div>

        <h1 className="w-full max-w-[550px] text-[24px] md:text-[28px] font-bold text-black text-left md:text-center mt-4">
          AI-Driven Career & Education Services: Expert{' '}
          <span className="text-primary font-bold">Guidance</span> for Success
        </h1>

        <p className="text-black text-[16px] font-medium text-left mt-4 w-full">
          We specialize in transforming career aspirations into real-world success through cutting-edge AI-powered solutions and expert guidance from industry leaders. Our services are tailored to equip students, professionals, and job seekers with essential skills, mentorship, and global opportunities.<br/><br/>
          Our Promise :  With AI-driven insights, industry expertise, and a commitment to excellence, we empower individuals to achieve their career aspirations and unlock new opportunities globally.
        </p>

        <div className="w-full md:overflow-x-auto hide-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:gap-x-[30px] gap-y-[15px] sm:gap-x-[15px] mt-[50px] items-center min-w-[200px]">
                {servicesList.map((service) => (
                <ServiceCard
                    key={service.id}
                    image={service.image}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    features={service.features}
                />
                ))}
            </div>
        </div>


        <div className="justify-center items-center mt-6">
            <Button text="Explore Our Services" className="max-w-[300px]"/>
        </div>
      </div>
    </section>
  );
};

export default Services;