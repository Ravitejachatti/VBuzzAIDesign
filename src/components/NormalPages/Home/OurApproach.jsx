import React from "react";

import approachicon1 from "../../../assets/approachicon1.png";
import approachicon2 from "../../../assets/approachicon2.png";
import approachicon3 from "../../../assets/approachicon3.png";
import approachicon4 from "../../../assets/approachicon4.png";

const OurApproach = () => {
    return (
        <section className="bg-primary/10 font-poppins md:px-[150px] md:py-[75px] p-[50px] items-center">
            <div className="max-w-7xl mx-auto flex flex-col">
                <div className="flex items-center gap-2 justify-left md:justify-center">
                <div className="w-[15px] h-[2px] bg-secondary"></div>
                <h6 className="text-[16px] font-semibold text-black">OUR APPROACH</h6>
                </div>

                <h1 className="w-full max-w-[716px] text-[24px] md:text-[28px] font-bold text-black text-left md:text-center md:mx-auto mt-4">
                    Smarter <span className="text-primary font-bold">Placements</span>. Seamless Journeys. AI-driven insights powering <span className="text-primary font-bold">campus-to-career success</span>
                </h1>


                <p className="text-black text-[16px] font-medium text-left mt-4 w-full">
                VBuzz transforms the campus-to-career journey with intelligent automation. From smart resume screening and predictive fit scoring to real-time skill-gap analysis and 24/7 chatbot support, our AI-driven platform streamlines every step of the placement process. Empower students, reduce recruiter workload, and elevate placement outcomes with data-backed insights and personalized interventions.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[40px] gap-y-[50px] md:gap-x-[40px] items-center mt-[50px]">
                    <div className="bg-white rounded-[20px] min-w-[250px]">
                        <img
                            src={approachicon1}
                            alt="Intelligent Candidate Matching"
                            className="w-[50px] h-[50px] mt-[-25px] ml-[25px]"
                        />
                        <div className="flex flex-col min-w-[200px] px-[30px] pb-[30px] pt-[15px] gap-y-[15px] sm:gap-y-[10px]">
                            <h1 className="text-[16px] font-bold text-black sm:mb-[15px]">Intelligent Candidate Matching</h1>
                            <p className="line-clamp-6 text-black text-[16px] font-medium text-left ml-4">
                                • Understands context in resumes using NLP (e.g., distinguishes "full-stack" from "web development").<br/>
                                • Predictive fit scores rank students based on GPA, test scores, and past placement trends.<br/>
                                • Real-time eligibility updates notify students as they become qualified.<br/>
                            </p>
                            <u className="text-[#8AC5F8] text-[16px]">Read More..</u>
                        </div>
                    </div>
                    <div className="bg-white rounded-[20px] min-w-[250px]">
                        <img
                            src={approachicon2}
                            alt="Intelligent Candidate Matching"
                            className="w-[50px] h-[50px] mt-[-25px] ml-[25px]"
                        />
                        <div className="flex flex-col min-w-[200px] px-[30px] pb-[30px] pt-[15px] gap-y-[15px] sm:gap-y-[10px]">
                            <h1 className="text-[16px] font-bold text-black sm:mb-[15px]">Placement Analytics</h1>
                            <p className="line-clamp-6 text-black text-[16px] font-medium text-left ml-4">
                                • Forecasts hiring trends across roles and departments using historical data.<br/>
                                • Flags at-risk students early via dropout prediction models.<br/>
                                • Analyzes recruiter feedback to uncover skill gaps and optimize training.<br/>
                            </p>
                            <u className="text-[#8AC5F8] text-[16px]">Read More..</u>
                        </div>
                    </div>
                    <div className="bg-white rounded-[20px] min-w-[250px]">
                        <img
                            src={approachicon3}
                            alt="Intelligent Candidate Matching"
                            className="w-[50px] h-[50px] mt-[-25px] ml-[25px]"
                        />
                        <div className="flex flex-col min-w-[200px] px-[30px] pb-[30px] pt-[15px] gap-y-[15px] sm:gap-y-[10px]">
                            <h1 className="text-[16px] font-bold text-black sm:mb-[15px]">Conversational AI Support</h1>
                            <p className="line-clamp-6 text-black text-[16px] font-medium text-left ml-4">
                                • 24/7 chatbot answers FAQs, schedules mock tests, and tracks applications.<br/>
                                • AI assistant helps new colleges set up profiles and workflows.<br/>
                                • Collects student feedback and runs sentiment analysis for continuous improvement.<br/>
                            </p>
                            <u className="text-[#8AC5F8] text-[16px]">Read More..</u>
                        </div>
                    </div>
                    <div className="bg-white rounded-[20px] min-w-[250px]">
                        <img
                            src={approachicon4}
                            alt="Intelligent Candidate Matching"
                            className="w-[50px] h-[50px] mt-[-25px] ml-[25px]"
                        />
                        <div className="flex flex-col min-w-[200px] px-[30px] pb-[30px] pt-[15px] gap-y-[15px] sm:gap-y-[10px]">
                            <h1 className="text-[16px] font-bold text-black sm:mb-[15px]">Skill-Gap Remediation</h1>
                            <p className="line-clamp-6 text-black text-[16px] font-medium text-left ml-4">
                                • Suggests personalized learning paths based on mock test and performance analytics.<br/>
                                • Adaptive mock tests adjust difficulty to accelerate mastery.<br/>
                                • Detects certificate fraud using AI-powered document verification.<br/>
                            </p>
                            <u className="text-[#8AC5F8] text-[16px]">Read More..</u>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurApproach;