import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const AcademicProjects = ({ goToNext }) => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const location = useLocation();

  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const studentData = response.data.student;
        setProjects(studentData.academicProjects || [
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
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setMessage({ text: "Failed to fetch projects.", type: "error" });
        setLoading(false);
      }
    };

    fetchProjects();
  }, [studentId, universityName, token]);

  const handleChange = (e, index, field, subField = null) => {
    const { value } = e.target;
    const updatedProjects = [...projects];
    if (subField) {
      updatedProjects[index][field][subField] = value;
    } else {
      updatedProjects[index][field] = value;
    }
    setProjects(updatedProjects);
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value.split(",").map((item) => item.trim());
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
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
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-projects?universityName=${encodeURIComponent(universityName)}`,
        { academicProjects: projects },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ text: "Projects updated successfully!", type: "success" });
      alert("Projects updated successfully!");
      if (goToNext) goToNext(); // Call the next step function
    } catch (error) {
      console.error("Failed to update projects:", error);
      setMessage({ text: "Failed to update projects.", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto ">
    <div className="overflow-hidden">
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-gray-800">Academic Projects</h1>
        <p className="text-gray-600 text-sm mt-1">
          Showcase your academic work and research projects.
        </p>
      </div>
  
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
        {projects.map((project, index) => (
          <div key={index} className="rounded-xl p-2 mb-1 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-700">
                {index + 1}. Project
              </h2>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center"
                >
                  🗑 Remove
                </button>
              )}
            </div>
  
            {/* Project Title, Level, Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title*</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleChange(e, index, "title")}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Smart Attendance System"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Level*</label>
                <select
                  value={project.level}
                  onChange={(e) => handleChange(e, index, "level")}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Role*</label>
                <input
                  type="text"
                  value={project.role}
                  onChange={(e) => handleChange(e, index, "role")}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Team Lead, Developer"
                  required
                />
              </div>
            </div>
  
            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Description*</label>
              <textarea
                value={project.description}
                onChange={(e) => handleChange(e, index, "description")}
                rows={3}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                placeholder="Describe the project objectives, scope, and your contributions"
                required
              />
            </div>
  
            {/* Tools, Outcomes, Research Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tools/Technologies Used</label>
                <textarea
                  value={project.toolsOrTechnologiesUsed.join(", ")}
                  onChange={(e) => handleArrayChange(e, index, "toolsOrTechnologiesUsed")}
                  rows={2}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., React, Node.js, TensorFlow"
                />
                <p className="text-xs text-gray-500">Separate with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes/Results</label>
                <textarea
                  value={project.outcomesOrResults}
                  onChange={(e) => handleChange(e, index, "outcomesOrResults")}
                  rows={2}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="Project outcomes, awards, or measurable results"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publications/Research Links</label>
                <input
                  type="text"
                  value={project.publicationsOrResearchLinks.join(", ")}
                  onChange={(e) => handleArrayChange(e, index, "publicationsOrResearchLinks")}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., GitHub link, DOI, etc."
                />
                <p className="text-xs text-gray-500">Separate multiple links with commas</p>
              </div>
            </div>
          </div>
        ))}
  
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={addProject}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            + Add Another Project
          </button>
  
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            ✔ Save and Next
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default AcademicProjects;