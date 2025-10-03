import React from 'react';

const TeamMemberCard = ({ image, name, role, color, textColor}) => {
  return (
    <div
      className="w-[220px] h-[600px] rounded-full overflow-hidden relative items-center text-center"
      style={{ backgroundColor: color, color: textColor }}
    >
      {/* Name & Role */}
      <div className="flex flex-col items-center pt-[80px] px-4">
        <h2 className="font-bold text-lg">{name}</h2>
        <p className="text-sm font-medium">{role}</p>
      </div>

      {/* Masked Image at Bottom */}
      <img
        src={image}
        alt={name}
        className="w-full h-[400px] object-cover absolute bottom-0"
      />
    </div>
  );
};

export default TeamMemberCard;
