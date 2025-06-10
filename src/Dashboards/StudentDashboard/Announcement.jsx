import React from 'react';

const Announcements = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Announcements and Updates</h2>
      <ul className="list-disc pl-5 text-gray-600 space-y-2">
        <li>Placement Drive on August 15th, 2023 - Tech Companies</li>
        <li>Webinar: Career in Data Science - August 18th, 2023</li>
        <li>Mock Interview Session - August 20th, 2023</li>
      </ul>
    </div>
  );
};

export default Announcements;
