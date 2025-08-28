// src/Dashboards/Placement/Rounds/UpdateRoundModal.jsx
import React from "react";
import { X, Edit } from "lucide-react";

const UpdateRoundModal = ({ open, onClose, updateRoundData, setUpdateRoundData, handleUpdateRound }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-600 to-yellow-700">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-bold">Update Round</h2>
              <p className="text-yellow-100 text-sm">Edit round details</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Round Name</label>
              <input
                type="text"
                value={updateRoundData.name}
                onChange={(e) => setUpdateRoundData({ ...updateRoundData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Round Description</label>
              <textarea
                value={updateRoundData.description}
                onChange={(e) => setUpdateRoundData({ ...updateRoundData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF Link</label>
              <input
                type="url"
                value={updateRoundData.pdfLink}
                onChange={(e) => setUpdateRoundData({ ...updateRoundData, pdfLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Link</label>
              <input
                type="url"
                value={updateRoundData.examLink}
                onChange={(e) => setUpdateRoundData({ ...updateRoundData, examLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleUpdateRound} className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Edit className="w-4 h-4 mr-2" />
            Update Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoundModal;
