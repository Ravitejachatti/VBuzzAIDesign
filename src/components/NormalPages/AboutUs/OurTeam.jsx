import React from 'react'
import { useState } from 'react'

import member1 from '../../../assets/member1.png'

import TeamMemberCard from '../../Resuable/cards/TeamMemberCard'

const members = [
  {
    id: 1,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 2,
    category: "Category 2",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 3,
    category: "Category 3",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 4,
    category: "Category 4",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 5,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 6,
    category: "Category 2",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 7,
    category: "Category 3",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 8,
    category: "Category 4",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 9,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 10,
    category: "Category 2",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 11,
    category: "Category 3",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 12,
    category: "Category 4",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 13,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 14,
    category: "Category 4",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 15,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 16,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 17,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 18,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 19,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  },
  {
    id: 20,
    category: "Category 1",
    image: member1,
    name: "John Doe",
    role: "CEO, Founder",
    color: "#C4C9CC",
    textcolor: "#402E23"
  }
]

const categories = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4"
]

const OurTeam = () => {

  const [filter, setFilter] = useState("Category 1");
  
      const handleClick = (category) => {
          setFilter(category);
      }
  
      const filteredMembers = members.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  return (
    <section className='bg-black/80 p-[50px] md:px-[150px] mt-[50px] md:mt-[75px] md:py-[75px]'>
      <h1 className='text-[24px] text-white font-bold'>Meet the Experts Behind VCBIL   Driving Innovation, Mentorship, and Career Success</h1>
      <p className='text-[16px] text-white/60 font-medium mt-[15px]'>Our team consists of industry leaders, academic experts, bureaucrats, and diplomats who are committed to helping you achieve your career goals.</p>

      <div className='flex flex-col gap-[50px] mt-[50px]'>
        {/* Categories */}
        <div className="overflow-x-auto hide-scrollbar rounded-full justify-center items-center">
          <div className="bg-white flex justify-between">
            {categories.map((category) => {
              const isActive = filter === category;

              return (
                <button
                  key={category}
                  className={`px-8 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#595959] text-white'
                      : 'bg-white text-black'
                  }`}
                  onClick={() => handleClick(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* <div className="hidden sm:block">
          <div className="bg-white flex flex-col gap-8 w-[100px] h-[400px] overflow-x-auto hide-scrollbar rounded-full">
            {categories.map((category) => {
              const isActive = filter === category;

              return (
                <button
                  key={category}
                  className={`w-full px-8 py-4 text-sm font-medium whitespace-nowrap transform rotate-90 transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#595959] text-white'
                      : 'bg-white text-black'
                  }`}
                  onClick={() => handleClick(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div> */}

        {/* Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-[15px] sm:gap-y-[30px] gap-y-[15px] mt-[50px] justify-items-center">
          {filteredMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              image={member.image}
              name={member.name}
              role={member.role}
              color={member.color}
              textcolor={member.textcolor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurTeam