import React from "react";
import { Link } from "react-router-dom";

const Button = ({ 
  text = "Get Started", 
  to,
  bgColor = "bg-secondary",
  textColor = "text-white",
  className = ""
}) => {
  return (
    <Link
      to={to}
      className={`
        inline-block 
        ${bgColor} 
        ${textColor}
        hover:${textColor}
        font-bold 
        rounded-full
        text-xs 
        text-center
        items-center
        justify-center
        text-xs  
        px-4 
        py-2
        max-w-[150px]
        sm:px-8 
        sm:py-3.5 
        md:px-4
        md:py-4
        md:w-[220px]
        md:h-[50px]


        ${className}
      `}
    >
      {text}
    </Link>
  );
};

export default Button;