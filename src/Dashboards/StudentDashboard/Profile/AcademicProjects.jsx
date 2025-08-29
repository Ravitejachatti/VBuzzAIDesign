// src/Dashboards/StudentDashboard/Profile/AcademicProjects.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAcademicProjects,
  updateAcademicProjects,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/academicProjectsSlice";
import { useParams, useLocation } from "react-router-dom";

const AcademicProjects = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Determine studentId from location state or localStorage
  const studentDataFromLocation =
    location.state || JSON.parse(localStorage.getItem("studentData") || "{}");
  const studentId =
    studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  // Read Redux state
  const { data, loading, error, updateStatus } = useSelector(
    (state) => state.academicProjects
  );

  // Local state for form editing
  const [projects, setProjects] = useState([
    {
      title: "",
      level: "",
      description: "",
      role: "",
      toolsOrTechnologiesUsed: [],
      outcomesOrResults: "",
      publicationsOrResearchLinks: [],
    },
  ]);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Populate local state when Redux data arrives
  useEffect(() => {
    if (Array.isArray(data)) {
      const cloned = JSON.parse(
        JSON.stringify(
          data.length
            ? data
            : [
                {
                  title: "",
                  level: "",
                  description: "",
                  role: "",
                  toolsOrTechnologiesUsed: [],
                  outcomesOrResults: "",
                  publicationsOrResearchLinks: [],
                },
              ]
        )
      );
      setProjects(cloned);
    }
  }, [data]);

  // Fetch initial data on mount
  useEffect(() => {
    if (studentId && universityName && token) {
      dispatch(fetchAcademicProjects({ studentId, universityName, token }));
    }
  }, [studentId, universityName, token, dispatch]);

  // Field-change handlers
  const handleChange = (e, index, field) => {
    const { value } = e.target;
    setProjects((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    setProjects((prev) => {
      const updated = [...prev];
      updated[index][field] = value.split(",").map((item) => item.trim());
      return updated;
    });
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        level: "",
        description: "",
        role: "",
        toolsOrTechnologiesUsed: [],
        outcomesOrResults: "",
        publicationsOrResearchLinks: [],
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  // Always send the full "projects" array on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateAcademicProjects({
        studentId,
        universityName,
        token,
        academicProjects: projects,
      })
    );
    setMessage({ text: "Updating projects...", type: "" });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000); // Clear message after 3 seconds
     if (updateStatus === "success") {
      setMessage({ text: "Projects updated successfully!", type: "success" });
     }
     alert("Projects updated successfully!");
    dispatch(clearUpdateStatus());
  };

  // React to updateStatus from Redux
  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({ text: "Projects updated successfully!", type: "success" });
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update projects.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, projects, goToNext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Academic Projects</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-green-50 border-green-300 text-green-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 mb-4 shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <h2 className="text-lg font-semibold">{idx + 1}. Project</h2>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑 Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title*
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleChange(e, idx, "title")}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Smart Attendance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Level*
                </label>
                <select
                  value={project.level}
                  onChange={(e) => handleChange(e, idx, "level")}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Select level</option>
                  <option value="University">University</option>
                  <option value="Departmental">Departmental</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role*
                </label>
                <input
                  type="text"
                  value={project.role}
                  onChange={(e) => handleChange(e, idx, "role")}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Team Lead"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description*
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleChange(e, idx, "description")}
                rows={2}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                placeholder="Describe objectives and contributions"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tools/Technologies Used
                </label>
                <textarea
                  value={project.toolsOrTechnologiesUsed.join(", ")}
                  onChange={(e) =>
                    handleArrayChange(e, idx, "toolsOrTechnologiesUsed")
                  }
                  rows={2}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., React, Node.js"
                />
                <p className="text-xs text-gray-500">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcomes/Results
                </label>
                <textarea
                  value={project.outcomesOrResults}
                  onChange={(e) => handleChange(e, idx, "outcomesOrResults")}
                  rows={2}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="Awards or measurable results"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publications/Research Links
                </label>
                <textarea
                  value={project.publicationsOrResearchLinks.join(", ")}
                  onChange={(e) =>
                    handleArrayChange(e, idx, "publicationsOrResearchLinks")
                  }
                  rows={2}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., GitHub link, DOI"
                />
                <p className="text-xs text-gray-500">Separate multiple links</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={addProject}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Another Project
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ✔ Save and Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicProjects;
