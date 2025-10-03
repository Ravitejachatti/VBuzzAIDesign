import React from "react";
import { useState } from "react";

import partner1 from '../../../assets/partner1.png'
import partner2 from '../../../assets/partner2.png'
import partner3 from '../../../assets/partner3.png'

const partners = [
    {
        id: 1,
        category: "University Partners",
        image: partner1
    },
    {
        id: 2,
        category: "Coorperate Partners",
        image: partner2
    },
    {
        id: 3,
        category: "Category 3",
        image: partner3
    },
    {
        id: 4,
        category: "University Partners",
        image: partner1
    },
    {
        id: 5,
        category: "Coorperate Partners",
        image: partner2
    },
    {
        id: 6,
        category: "University Partners",
        image: partner3
    },
    {
        id: 7,
        category: "University Partners",
        image: partner1
    },
    {
        id: 8,
        category: "Coorperate Partners",
        image: partner2
    },
    {
        id: 9,
        category: "Category 3",
        image: partner2
    },
]

const categories = [
  "University Partners",
  "Coorperate Partners",
  "Category 3",
  "Category 4",
  "Category 5",
  "Category 6",
];


const OurPartners = () => {

    const [filter, setFilter] = useState("University Partners");

    const handleClick = (category) => {
        setFilter(category);
    }

    const filteredPartners = partners.filter(item => item.category === filter);

    return(
        <section className="bg-white font-poppins px-[50px] md:px-[150px] md:py-[75px] py-[50px] sm:items-center">
            <div className="lg:flex lg:flex-row sm:items-center lg:gap-[50px] sm:flex sm:flex-col sm:gap-[30px]">
                <div className="flex flex-col gap-4 lg:min-w-[350px] lg:max-w-[550px] lg:items-start sm:items-center sm:mt-[30px]">
                    <div className="flex items-center gap-2">
                        <div className="w-[15px] h-[2px] bg-secondary"></div>
                        <h6 className="text-[16px] font-semibold text-black">OUR PARTNERS</h6>
                    </div>

                    <h1 className="w-full text-[24px] font-bold text-black lg:text-left sm:text-center">
                        Strengthening Careers Through Strategic{' '}
                        <span className="text-primary font-bold">Partnerships</span> and Innovation
                    </h1>

                    <p className="w-full text-[16px] font-medium text-black text-justify">
                        Collaborating with industry leaders to drive growth, technology, and career success.   We build strong alliances to provide cutting-edge solutions and AI-driven insights.   Our partnerships enhance career opportunities through strategic networking and expertise.   Together, we empower individuals with technology, mentorship, and global connections.   Join us in shaping a future where partnerships unlock limitless possibilities.
                    </p>
                </div>

                <div className="flex flex-col max-w-[540px] gap-[30px] lg:min-w-[350px] lg:max-w-[540px] mt-6">
                    <div className="overflow-x-auto hide-scrollbar w-full">
                        <div className="flex gap-4">
                            {categories.map((category) => {
                                const isActive = filter === category;

                                return (
                                    <button
                                    key={category}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                                        isActive
                                        ? 'bg-primary text-white'
                                        : 'bg-primary/10 text-black'
                                    }`}
                                    onClick={() => handleClick(category)}
                                    >
                                    {category}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-x-[15px] gap-y-[15px]">
                        {
                            filteredPartners.map((item, index) => (
                                <img
                                    key={index}
                                    src={item.image}
                                    alt="partner"
                                    className="w-full h-full object-cover"
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OurPartners;