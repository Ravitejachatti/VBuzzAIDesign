import React from "react";

const ServiceCard = ({ image, icon, title, description, features}) => {
    return (
        <div className="flex flex-col items-left bg-white rounded-[20px] max-w-[350px] mx-auto max-h[600px] sm:min-w-[250px] md:min-w-[400px] shadow-custom-nav">
            {/* image and icon */}
            <div>
                <img src={image} alt={title} className="rounded-tl-[100px] sm:rounded-tl-[200px] sm:rounded-tl-[150px]" />
                <img src={icon} alt={title} className="w-[30px] h-[30px] mt-[-15px] ml-[15px] md:ml-[25px] md:mt-[-25px] md:w-[50px] md:h-[50px]"/>
            </div>

            {/* Title and description */}
            <div className="flex flex-col p-6 w-full md:px-[30px] sm:px-[24px] gap-6">
                <h1 className="text-xs sm:text-[16px] font-bold">{title}</h1>
                <p className=" text-xs sm:text-[16px] font-medium">{description}</p>
                <p className="line-clamp-3 text-xs sm:text-[16px] sm:line-clamp-4 text-black whitespace-pre-line md:ml-4 sm:ml-2 mt-[-15px]">
                {features.map((item) => `• ${item.feature}`).join('\n')}
                </p>

                <u className="text-[#8AC5F8] text-xs sm:text-[16px]">Read More..</u>
            </div>
        </div>
    );
};

export default ServiceCard;


// const ServiceCard = ({image, icon, title, description, features}) => {

//     return (
//         <div>
//             {/* Image + Icon */}
//             <div>
//                 <img
//                     src={image}
//                     alt={title}
//                     className="w-full h-full object-cover shrink-0 rounded-tl-[20px]"
//                 />
//                 <img
//                     src={icon}
//                     alt={title}
//                     className="w-[30px] h-[30px] object-cover shrink-0 mt-[-15px]"
//                 />
//             </div>

//             {/* Details */}
//             <div>

//             </div>
//         </div>
//     )

// }

// export default ServiceCard