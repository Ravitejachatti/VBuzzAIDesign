import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import styles

const ToggleEligibility = ({ selectedStudents, onStatusUpdate }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleConfirmChange = (canApplyStatus) => {
    confirmAlert({
      title: 'Confirm Eligibility Change',
      message: `Are you sure you want to mark ${selectedStudents.length} student(s) as ${canApplyStatus ? 'eligible' : 'ineligible'}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleApplyEligibilityChange(canApplyStatus)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleApplyEligibilityChange = async (canApplyStatus) => {
    if (!selectedStudents || selectedStudents.length === 0) {
      setMessage("Please select at least one student");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/job/jobs/canApply?universityName=${universityName}`,
        {
          studentIds: selectedStudents.map(s => s._id),
          canApply: canApplyStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success confirmation
      confirmAlert({
        title: 'Success',
        message: response.data.message || `Successfully updated ${selectedStudents.length} student(s)`,
        buttons: [
          {
            label: 'OK',
            onClick: () => {}
          }
        ]
      });

      // Update parent component
      const updatedStudents = selectedStudents.map(student => ({
        ...student,
        canApply: canApplyStatus
      }));
      onStatusUpdate(updatedStudents);
      
      setMessage("");
    } catch (err) {
      console.error("Error updating eligibility:", err);
      setMessage(err.response?.data?.error || "Failed to update eligibility");
      
      // Show error confirmation
      confirmAlert({
        title: 'Error',
        message: err.response?.data?.error || "Failed to update eligibility",
        buttons: [
          {
            label: 'OK',
            onClick: () => {}
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded border">
      <h3 className="text-lg font-medium mb-2 text-right">
        Bulk Eligibility Update ({selectedStudents.length} selected)
      </h3>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => handleConfirmChange(true)}
          disabled={loading}
          className={`px-1 py-1 rounded text-white  ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Mark as Eligible"}
        </button>
        
        <button
          onClick={() => handleConfirmChange(false)}
          disabled={loading}
          className={`px-1 py-1 rounded text-white ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : "Mark as Ineligible"}
        </button>
      </div>
      
      {message && (
        <p className={`mt-2 text-sm ${
          message.includes("success") ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ToggleEligibility;