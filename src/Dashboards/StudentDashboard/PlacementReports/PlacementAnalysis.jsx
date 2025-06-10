// src/Dashboards/StudentDashboard/PlacementAnalysis.jsx

import React,{useState} from 'react';

const PlacementAnalysis = ({studnets}) => {
  const [loading, setloading] = useState(true);


    console.log("Student Data in Placement Analysis:", studnets);
  const placements = studnets?.student?.placements || [];

  const totalApplied = placements.length;
  const selectedCompanies = placements.filter(company => company.status === "Hired");
  const totalSelected = selectedCompanies.length;
  const totalOfferLetters = selectedCompanies.filter(company => company.offerLetterLink).length;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 underline">Placement Tracker & Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Companies Applied</h3>
          <p className="text-3xl font-bold">{totalApplied}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Companies Selected</h3>
          <p className="text-3xl font-bold">{totalSelected}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Offer Letters Received</h3>
          <p className="text-3xl font-bold">{totalOfferLetters}</p>
        </div>
      </div>

      {/* Table for details */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">#</th>
              <th className="border px-4 py-2 text-left">Company</th>
              <th className="border px-4 py-2 text-left">Role</th>
              <th className="border px-4 py-2 text-left">CTC (INR)</th>
              <th className="border px-4 py-2 text-left">Offer Letter</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((placement, index) => (
              <tr key={index} className="text-sm">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{placement.companyName || '-'}</td>
                <td className="border px-4 py-2">{placement.role || '-'}</td>
                <td className="border px-4 py-2">{placement.ctc ? `₹${placement.ctc.toLocaleString()}` : '-'}</td>
                <td className="border px-4 py-2">
                  {placement.offerLetterLink ? (
                    <a
                      href={placement.offerLetterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="border px-4 py-2">
                  {placement.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementAnalysis;
