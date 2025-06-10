import React from 'react';

const JobOffers = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Offers and Selections</h2>
      <p className="text-gray-600">View and compare job offers you've received.</p>
      <div className="text-gray-600 mt-3">
        <div className="flex justify-between py-2 border-b">
          <span>Software Engineer - Google</span>
          <span className="text-blue-500">$120,000</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Data Analyst - Microsoft</span>
          <span className="text-blue-500">$110,000</span>
        </div>
      </div>
    </div>
  );
};

export default JobOffers;
