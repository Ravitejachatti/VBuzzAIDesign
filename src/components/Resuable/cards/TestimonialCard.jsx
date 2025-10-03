import React from "react";

const TestimonialCard = ({ name, username, image, icon, testimonial, height }) => {
  return (
    <div
      className={`group min-w-[200px] sm:min-w-[250px] sm:min-gap-[30px] lg:min-w-[170px] [perspective:1000px] flex items-center justify-center`}
      style={{ height: height || undefined }}
    >
      <div className="relative w-full h-full transition-transform duration-700 flip-container flip-hover">
        
        {/* Front Side */}
        <div className="absolute inset-0 rounded-2xl bg-white z-20 [backface-visibility:hidden]">
          <img
            src={image}
            alt="User"
            className="h-full w-full object-cover rounded-2xl shadow-custom-nav"
          />
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 rounded-2xl bg-white text-black px-4 py-6 text-center text-sm leading-relaxed [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex items-center mb-4">
            <img
              src={icon}
              alt={name}
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div className="ml-3 text-left">
              <h1 className="text-sm font-semibold">{name}</h1>
              <h6 className="text-xs text-gray-600">@{username}</h6>
            </div>
          </div>
          <p className="text-left text-sm">{testimonial}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
