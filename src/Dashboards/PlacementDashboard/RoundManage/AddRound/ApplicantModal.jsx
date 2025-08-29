// src/Dashboards/Placement/Rounds/ApplicantsModal.jsx
import React from "react";
import { X, Users } from "lucide-react";

const ApplicantsModal = ({ open, onClose, applicants = [] }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-height-[80vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-bold">Round Applicants</h2>
              <p className="text-blue-100 text-sm">{applicants.length} applicants</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {applicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applicants.map((a, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{a.registered_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            a.status?.toLowerCase() === "selected"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{a.feedback || "No feedback"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants</h3>
              <p className="text-gray-500">No students have been added to this round yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;
