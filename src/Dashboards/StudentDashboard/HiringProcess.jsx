import React from 'react';

const HiringProcessOverview = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Hiring Process Overview</h2>
      <p className="text-gray-600">Upcoming interviews and preparation resources for job applications.</p>
      <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-600">
        <li>Google Interview - July 20th, 2023, Online</li>
        <li>Microsoft Interview - July 22nd, 2023, On-Campus</li>
      </ul>
    </div>
  );
};

export default HiringProcessOverview;
