// VBuzzHomepage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Removed incorrect imports
// import { Icon } from 'lucide-react'; // Incorrect import
// import { FontAwesomeIcon } from 'react-icons'; // Incorrect import

import hero from "../../../assets/HERO.png"
import University1 from '../../../assets/University1.png'
import University2 from '../../../assets/University2.png'
import University3 from '../../../assets/University3.png'
import Button from "../../Resuable/Button";

const VBuzzHomepage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const duration = 2500;

  return (
    <section className="bg-primary flex flex-col lg:flex-row px-[50px] md:px-[150px] mt-[-50px] justify-between items-center">
      {/* Title + Image */}
      <div className="flex flex-row w-full">
        <div className='mt-[150px] pb-[50px] md:max-w-[350px]'>
          <h1 className='w-full text-white text-[24px] sm:text-[48px] font-bold pb-5'>
            <span className="text-secondary">Connecting</span> Talent with Opportunity
          </h1>

          <Button text="Get Started"/>
        </div>

        <img
          src={hero}
          alt='COnnecting Students, Universities and Coorperate'
          className='w-full max-w-[100px] max-h-[400px] md:max-h-full object-cover sm:max-w-[150px] lg:w-[250px] md:shrink-0 justify-center'
        />
      </div>

      <div className="w-full flex flex-col text-left text-white lg:mt-[150px] mb-[50px] lg:pl-4 lg:max-w-[300px]">
        <div className='flex mb-2'>
          <img src={University1} alt="University 1" className="w-[40px] h-[40px] mr-[-15px]" />
          <img src={University2} alt="University 2" className="w-[40px] h-[40px] mr-[-15px]" />
          <img src={University3} alt="University 3" className="w-[40px] h-[40px] mr-[-15px]" />
          <button className='bg-secondary w-[40px] h-[40px] rounded-full flex items-center justify-center border border-white'>+</button>
        </div>
        <p className="text-[16px] font-medium lg:mb-[100px] mb-2">
          15k+ satisfied Universities all over India
        </p>
        <div className="w-[100px] h-[2px] bg-secondary mb-4"></div>
        <p className="text-[16px]">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text.
        </p>
      </div>
    </section>
  )
};

export default VBuzzHomepage;
