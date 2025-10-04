import React from "react";

import TestimonialCard from "../../Resuable/cards/TestimonialCard";
import Button from "../../Resuable/Button";

import user1 from "../../../assets/user1.png";
import user1icon from "../../../assets/user1icon.png";

const testimonials = [
  {
    name: "Mounika",
    username: "mounika",
    image: user1,
    icon: user1icon,
    testimonial: "Describe the service and how customers or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details ",
    width:"273px",
    height:"293px",
  },
  {
    name: "Mounika",
    username: "mounika",
    image: user1,
    icon: user1icon,
    testimonial: "Describe the service and how customers or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details ",
    width:"300px",
    height:"300px",
},
  {
    name: "Mounika",
    username: "mounika",
    image: user1,
    icon: user1icon,
    testimonial: "Describe the service and how customers or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details ",
    width:"242px",
    height:"363px",
},
  {
    name: "Mounika",
    username: "mounika",
    image: user1,
    icon: user1icon,
    testimonial: "Describe the service and how customers or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details ",
    width:"300px",
    height:"375px",
},
  {
    name: "Mounika",
    username: "mounika",
    image: user1,
    icon: user1icon,
    testimonial: "Describe the service and how customers or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details or cilents can benefit from it. it’s an oppurtunity to add a short description with relevant details ",
    width:"252px",
    height:"379px",
},  
];

const Testimonial = () => {
    return (
        <section className="bg-primary/10 font-poppins md:px-[150px] md:py-[75px] p-[50px]">
            <div className="flex justify-center">
                <div className="flex flex-col lg:flex-row gap-[15px] items-center sm:items-start">

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-[15px] sm:gap-x-[15px] items-start">
                        <TestimonialCard
                            name={testimonials[0].name}
                            username={testimonials[0].username}
                            image={testimonials[0].image}
                            icon={testimonials[0].icon}
                            testimonial={testimonials[0].testimonial}
                            height={testimonials[0].height}
                        />
                        <div className="sm:mt-[150px] lg:mt-[15px]">
                            <TestimonialCard
                            name={testimonials[1].name}
                            username={testimonials[1].username}
                            image={testimonials[1].image}
                            icon={testimonials[1].icon}
                            testimonial={testimonials[1].testimonial}
                            height={testimonials[1].height}
                            />
                        </div>
                    </div>

                    <div className="sm:mt-[-150px] lg:mt-[137px]">
                        <TestimonialCard
                            name={testimonials[2].name}
                            username={testimonials[2].username}
                            image={testimonials[2].image}
                            icon={testimonials[2].icon}
                            testimonial={testimonials[2].testimonial}
                            height={testimonials[2].height}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-[15px] sm:gap-x-[15px] items-start">
                        <div className="lg:mt-[29px]">
                            <TestimonialCard
                            name={testimonials[3].name}
                            username={testimonials[3].username}
                            image={testimonials[3].image}
                            icon={testimonials[3].icon}
                            testimonial={testimonials[3].testimonial}
                            height={testimonials[3].height}
                            />
                        </div>
                        <div className="sm:mt-[-220px] lg:mt-[179px]">
                            <TestimonialCard
                            name={testimonials[4].name}
                            username={testimonials[4].username}
                            image={testimonials[4].image}
                            icon={testimonials[4].icon}
                            testimonial={testimonials[4].testimonial}
                            height={testimonials[4].height}
                            />
                        </div>
                    </div>

                </div>
            </div>


            <div className="max-w-7xl mx-auto flex flex-col items-center mt-[50px] lg:mt-0">
                <div className="flex items-center gap-2 justify-center">
                <div className="w-[15px] h-[2px] bg-secondary"></div>
                <h6 className="text-[16px] font-semibold text-black">TESTIMONIALS</h6>
                </div>

                <h1 className="w-full max-w-[716px] text-[24px] md:text-[28px] font-bold text-black text-center mt-4">
                Real Voices, Real Impact   Authentic success stories from those empowered by AI-driven guidance
                </h1>

                <p className="text-black text-[16px] font-medium text-left mt-4 w-full">
                Discover how AI technology and expert mentorship have transformed careers and unlocked new opportunities. From students launching successful careers to professionals advancing in their industries, these testimonials showcase the power of innovation and personalized support. Hear directly from those who have experienced the journey firsthand and see how AI-driven insights can make a lasting impact on professional growth.
                </p>

                <div className="justify-center items-center mt-6">
                    <Button text="Read our success Stories" to={"/testimonials"} className="max-w-[300px]"/>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;