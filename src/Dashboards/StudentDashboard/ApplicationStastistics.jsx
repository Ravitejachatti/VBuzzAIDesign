import React from 'react';

const ApplicationStatistics= () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Statistics and Analytics</h2>
      <div className="flex justify-between text-gray-600">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-bold text-blue-500">20</p>
          <p>Total Applications</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl font-bold text-green-500">8</p>
          <p>Shortlisted</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl font-bold text-yellow-500">40%</p>
          <p>Selection Rate</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatistics;
