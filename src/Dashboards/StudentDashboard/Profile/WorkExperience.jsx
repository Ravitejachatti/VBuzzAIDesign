// src/Dashboards/StudentDashboard/Profile/UpdateExperience.jsx

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkExperience,
  updateWorkExperience,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/workExperienceSlice";
import { useParams, useLocation } from "react-router-dom";

//have to add a fileds:   experianceCertificateLink: { type: String }


const UpdateExperience = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const studentDataFromLocation =
    location.state || JSON.parse(localStorage.getItem("studentData") || "{}");
  const studentId =
    studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  // Pull Redux state
  const { data, loading, updateStatus } = useSelector(
    (state) => state.workExperience
  );

  // Local state for editing (initialize to a single empty experience)
  const [workExperience, setWorkExperience] = useState([
    {
      companyName: "",
      position: "",
      duration: "",
      responsibilitiesAndAchievements: [""],
      skillsAcquired: [""],
      experianceCertificateLink: "", // Uncomment if you want to include this field
    },
  ]);

  const [message, setMessage] = useState({ text: "", type: "" });

  // We only want to initialize local state once when 'data' arrives.
  const didInitialize = useRef(false);

  // ① Fetch on mount
  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(fetchWorkExperience({ studentId, universityName, token, BASE_URL }));
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  // ② Initialize local 'workExperience' from Redux 'data' exactly once.
  useEffect(() => {
    if (Array.isArray(data) && !didInitialize.current) {
      const normalized = data.length
        ? data.map((exp) => ({
            companyName: exp.companyName || "",
            position: exp.position || "",
            duration: exp.duration || "",
            responsibilitiesAndAchievements:
              exp.responsibilitiesAndAchievements && exp.responsibilitiesAndAchievements.length
                ? exp.responsibilitiesAndAchievements.slice()
                : [""],
            skillsAcquired:
              exp.skillsAcquired && exp.skillsAcquired.length ? exp.skillsAcquired.slice() : [""],
            experianceCertificateLink: exp.experianceCertificateLink || "", // Uncomment if you want to include this field
          }))
        : [
            {
              companyName: "",
              position: "",
              duration: "",
              responsibilitiesAndAchievements: [""],
              skillsAcquired: [""],
              experianceCertificateLink: "", // Uncomment if you want to include this field
            },
          ];

      setWorkExperience(normalized);
      didInitialize.current = true;
    }
  }, [data]);

  // ③ Handlers for normal fields
  const handleChange = (e, idx, field) => {
    const { value } = e.target;
    setWorkExperience((prev) => {
      const copy = prev.map((entry, i) =>
        i === idx ? { ...entry, [field]: value } : entry
      );
      return copy;
    });
  };

  // ④ Handlers for array fields (immutable)
  const handleArrayItemChange = (e, idx, arrayField, itemIndex) => {
    const { value } = e.target;
    setWorkExperience((prev) => {
      return prev.map((entry, i) => {
        if (i !== idx) return entry;
        const oldArray = entry[arrayField] || [];
        const newArray = oldArray.map((item, j) =>
          j === itemIndex ? value : item
        );
        return { ...entry, [arrayField]: newArray };
      });
    });
  };

  const addArrayItem = (idx, arrayField) => {
    setWorkExperience((prev) => {
      return prev.map((entry, i) => {
        if (i !== idx) return entry;
        // Build a brand-new array instead of pushing into the old one
        const oldArray = entry[arrayField] || [];
        return {
          ...entry,
          [arrayField]: [...oldArray, ""],
        };
      });
    });
  };

  const removeArrayItem = (idx, arrayField, itemIndex) => {
    setWorkExperience((prev) => {
      return prev.map((entry, i) => {
        if (i !== idx) return entry;
        const oldArray = entry[arrayField] || [];
        // Remove by filtering
        const newArray = oldArray.filter((_, j) => j !== itemIndex);
        // Ensure at least one blank remains
        return {
          ...entry,
          [arrayField]: newArray.length ? newArray : [""],
        };
      });
    });
  };

  // ⑤ Add or remove entire experience entries
  const addExperience = () => {
    setWorkExperience((prev) => [
      ...prev,
      {
        companyName: "",
        position: "",
        duration: "",
        responsibilitiesAndAchievements: [""],
        skillsAcquired: [""],
        experianceCertificateLink: "", // Uncomment if you want to include this field
      },
    ]);
  };

  const removeExperience = (idx) => {
    setWorkExperience((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  };

  // ⑥ Submit always sends the full array
  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = workExperience.map((exp) => ({
      companyName: exp.companyName,
      position: exp.position,
      duration: exp.duration,
      responsibilitiesAndAchievements: exp.responsibilitiesAndAchievements.filter(
        (x) => x.trim() !== ""
      ),
      skillsAcquired: exp.skillsAcquired.filter((x) => x.trim() !== ""),
      experianceCertificateLink: exp.experianceCertificateLink || "", // Uncomment if you want to include this field
    }));

    dispatch(
      updateWorkExperience({
        studentId,
        universityName,
        token,
        BASE_URL,
        workExperience: cleaned,
      })
    );
  };

  // ⑦ React to updateStatus changes
  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({ text: "Work experience updated successfully!", type: "success" });
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update work experience.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Work Experience</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-gray-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {workExperience.map((experience, idx) => (
          <div
            key={idx}
            className="rounded-lg mb-4 p-4 shadow-sm border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {idx + 1}. Experience
              </h2>
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                disabled={workExperience.length <= 1}
                className="text-gray-600 hover:text-red-800 text-sm px-2 py-1 border rounded-md"
              >
                Remove
              </button>
            </div>

            {/* Company, Position, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  value={experience.companyName}
                  onChange={(e) => handleChange(e, idx, "companyName")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Google Inc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position*
                </label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => handleChange(e, idx, "position")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration*
                </label>
                <input
                  type="text"
                  value={experience.duration}
                  onChange={(e) => handleChange(e, idx, "duration")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., June 2020 – Present"
                  required
                />
              </div>
            </div>

            {/* Responsibilities & Achievements */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Responsibilities & Achievements
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem(idx, "responsibilitiesAndAchievements")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center border px-2 py-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {experience.responsibilitiesAndAchievements.map(
                  (item, rIdx) => (
                    <div key={rIdx} className="flex space-x-2 items-start">
                      <span className="mt-2 text-gray-500">{rIdx + 1}.</span>
                      <input
                        value={item}
                        onChange={(e) =>
                          handleArrayItemChange(
                            e,
                            idx,
                            "responsibilitiesAndAchievements",
                            rIdx
                          )
                        }
                        
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                        placeholder="Responsibility or achievement"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem(
                            idx,
                            "responsibilitiesAndAchievements",
                            rIdx
                          )
                        }
                        className="text-gray-500 hover:text-red-700 p-1 border rounded-md"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Skills Acquired */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Skills Acquired
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem(idx, "skillsAcquired")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center border px-2 py-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1  |0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {experience.skillsAcquired.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) =>
                        handleArrayItemChange(
                          e,
                          idx,
                          "skillsAcquired",
                          sIdx
                        )
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                      placeholder="e.g., React, Node.js"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem(idx, "skillsAcquired", sIdx)
                      }
                      className="text-gray-500 hover:text-red-700 p-1 border rounded-md"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Certificate Link */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Certificate Link
              </label>
              <input
                type="text" 
                value={experience.experianceCertificateLink}
                onChange={(e) => handleChange(e, idx, "experianceCertificateLink")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                placeholder="e.g., https://example.com/certificate.pdf"
              />      
          </div>
          </div>
        ))}

        {/* “Add Experience” and “Submit” buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Experience
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            📌 Please review all details before updating.
          </p>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Update and Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateExperience;
