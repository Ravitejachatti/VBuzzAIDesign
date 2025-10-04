import React from 'react';

import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export const UpcomingEventCard = ({ title, date, time, location, image }) => {
  return (
    <div 
      className="max-h-[500px] max-w-[1140px] bg-white rounded-[20px] shadow-custom-field relative items-center mx-[50px] md:mx-[150px]  md:mt-[150px] mt-[50px]">
      <img src={image} alt={title} className="w-full h-full object-cover rounded-[20px]" />
      <div className="w-full absolute inset-0 bg-black/40 rounded-[20px] flex items-end p-[15px] md:p-[30px] text-white">
        <div className='absolute top-[15px] left-[15px] md:top-[30px] md:left-[30px] bg-white rounded-full py-[5px] px-[15px] text-primary text-[12px]  font-bold'>Upcoming Event</div>
        <div className="flex flex-col gap-2 md:gap-4">
                  <div  className="flex flex-row items-center border border-white p-4 rounded-full h-[30px] min-w-[225px] max-w-[280px] md:max-w-[300px] gap-2">
                    <div className="flex flex-row items-center gap-1">
                      <FaCalendarAlt className="text-white text-[10px] sm:text-[12px]" />
                      <span className="text-white font-medium text-[10px] sm:text-[12px]">{date}</span>
                    </div>
                    <div className="w-[2px] h-[20px] bg-white"></div>
                    <div className="flex flex-row items-center gap-1">
                      <FaClock className="text-white text-[10px] sm:text-[12px]" />
                      <span className="text-white font-medium text-[10px] sm:text-[12px]">{time}</span>
                    </div>
                  </div>
        
                  <h1 className="text-white text-xs md:text-[16px] font-bold lg:max-w-[250px]">{title}</h1>
        
                  <div className="flex flex-row items-center gap-1">
                    <FaMapMarkerAlt className="text-white text-[12px] md:text-[16px] sm:text-[12px]" />
                    <span className="text-white font-medium text-xs md:text-[16px]  md:text-[16px]">{location}</span>
                  </div>
                </div>
      </div>
    </div>
  );
};