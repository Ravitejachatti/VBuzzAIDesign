import React from "react";

import Button from "../../Resuable/Button";

import ourmission from "../../../assets/ourmission.png"

const OurMission = () => {
    return (
        <section className="bg-white font-poppins md:px-[150px] px-[50px] md:my-[75px] my-[50px]">
            <div className="flex flex-col lg:flex-row md:gap-[50px] items-center">
                <div className="md:w-[590px] md:h-[465px]">
                    <img 
                    src={ourmission} 
                    alt="ourmission" 
                    className="w-full md:max-w-[590px] md:h-[465px] object-cover"
                />
                </div>
                
                <div className="flex flex-col gap-4 md:max-w-[557px] md:items-start mt-[30px] md:mt-[50px] items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-[15px] h-[2px] bg-secondary"></div>
                        <h6 className="text-[16px] font-semibold text-black">OUR MISSION</h6>
                    </div>

                    <h1 className="w-full md:max-w-[557px] text-[24px] font-bold text-black lg:text-left ">
                        AI-Powered Success   Empowering Careers with{" "}
                        <span className="text-primary font-bold">Technology</span> &{" and "}
                        <span className="text-primary font-bold">Expertise</span>
                    </h1>

                    <p className="w-full md:max-w-[557px] text-[16px] font-medium text-black">
                        V Corporate Buzz International Pvt. Ltd. is committed to empowering youth and professionals with cutting-edge AI technology and expert guidance. By integrating innovation and industry expertise, we provide personalized career development solutions that pave the way for success in an ever-evolving job market.
                        <br /><br />Through AI-driven insights, virtual mentoring, and strategic partnerships, we equip individuals with the knowledge and skills needed to excel. Whether through interactive workshops, insightful webinars, or global networking opportunities, we are dedicated to shaping a future where technology and expertise unlock limitless possibilities.
                    </p>

                    <div className="justify-center mt-6">
                        <Button text="Join Us" to="/institute-boarding" className="max-w-[150px]"/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 justify-between sm:grid-cols-4 mt-[30px] lg:mt-[50px]">
                <div className="items-center flex flex-col gap-1 lg:gap-4">
                    <h1 className="text-lg lg:text-[36px] sm:text-[24px] font-bold text-black">1,00,000+</h1>
                    <p className="lg:text-[16px] text-[10px] font-bold text-black">Placements</p>
                </div>
                <div className="items-center flex flex-col gap-1 lg:gap-4">
                    <h1 className="text-lg lg:text-[36px] sm:text-[24px] font-bold text-black">5,000+</h1>
                    <p className="lg:text-[16px] text-[10px] font-bold text-black">Corporate Partners</p>
                </div>
                <div className="items-center flex flex-col gap-1 lg:gap-4">
                    <h1 className="text-lg lg:text-[36px] sm:text-[24px] font-bold text-black">300+</h1>
                    <p className="lg:text-[16px] text-[10px] font-bold text-black">Institution Partners</p>
                </div>
                <div className="items-center flex flex-col gap-1 lg:gap-4">
                    <h1 className="text-lg lg:text-[36px] sm:text-[24px] font-bold text-black">3,000+</h1>
                    <p className="lg:text-[16px] text-[10px] font-bold text-black">Workshops Conducted</p>
                </div>
            </div>
        </section>
    );
};

export default OurMission;