import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const UpdateSkills = ({ goToNext }) => {
  const { id } = useParams();
  const [skills, setSkills] = useState({
    technicalSkills: [],
    softSkills: [],
    languagesKnown: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const location = useLocation();

  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  useEffect(() => {
    const fetchSkills = async () => {
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
        setSkills({
          technicalSkills: studentData.skillsAndCompetencies?.technicalSkills || [],
          softSkills: studentData.skillsAndCompetencies?.softSkills || [],
          languagesKnown: studentData.skillsAndCompetencies?.languagesKnown || [],
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setMessage("Failed to fetch skills.");
        setLoading(false);
      }
    };

    fetchSkills();
  }, [studentId, universityName, token]);

  const handleChange = (e, field, index = null, subField = null) => {
    const { value } = e.target;
    if (index !== null && subField !== null) {
      const updatedArray = [...skills[field]];
      updatedArray[index][subField] = value;
      setSkills((prev) => ({
        ...prev,
        [field]: updatedArray,
      }));
    } else if (index !== null) {
      const updatedArray = [...skills[field]];
      updatedArray[index] = value;
      setSkills((prev) => ({
        ...prev,
        [field]: updatedArray,
      }));
    } else {
      setSkills((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addEntry = (field) => {
    setSkills((prev) => ({
      ...prev,
      [field]: [...prev[field], field === "languagesKnown" ? { language: "", proficiency: "" } : ""],
    }));
  };

  const removeEntry = (field, index) => {
    const updatedArray = skills[field].filter((_, i) => i !== index);
    setSkills((prev) => ({
      ...prev,
      [field]: updatedArray,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-skills?universityName=${encodeURIComponent(universityName)}`,
        { skillsAndCompetencies: skills },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Skills updated successfully!");
      alert("Skills updated successfully!");
      if (goToNext) goToNext();  // 👈 Navigate to next section
    } catch (error) {
      console.error("Failed to update skills:", error);
      setMessage("Failed to update skills.");
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
    <div className="mx-auto p-1 md:p-2">
      <div className= "">
        <h1 className="text-lg font-semibold text-gray-800 mb-1 md:mb-6">Update Skills and Competencies</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="">
          {/* Technical Skills Section */}
          <div className="mb-3">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Technical Skills</h2>
  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
    {skills.technicalSkills.map((skill, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="e.g., JavaScript, Python"
          value={skill}
          onChange={(e) => handleChange(e, "technicalSkills", index)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => removeEntry("technicalSkills", index)}
          className="text-gray-600 hover:text-red-800 text-sm font-bold flex items-center border p-1 rounded"
        >
         X
        </button>
      </div>
    ))}
  </div>
  <button
    type="button"
    onClick={() => addEntry("technicalSkills")}
    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-md text-sm transition duration-300"
  >
    + Skill
  </button>
</div>
<hr className="my-3 border-t border-gray-300" />


          {/* Soft Skills Section */}
          <div className="mb-6">
  <h2 className="text-xl font-semibold text-gray-800 ">Soft Skills</h2>
  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
    {skills.softSkills.map((skill, index) => (
      <div key={index} className="flex items-center space-x-1 md:space-x-2  p-2">
        <input
          type="text"
          placeholder="e.g., Communication, Leadership"
          value={skill}
          onChange={(e) => handleChange(e, "softSkills", index)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => removeEntry("softSkills", index)}
          className="text-gray-600 hover:text-red-800 text-sm font-medium flex items-center border p-2 rounded mx-5"
        >
        X
        </button>
      </div>
    ))}
  </div>
  <button
    type="button"
    onClick={() => addEntry("softSkills")}
    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-md text-sm transition duration-300"
  >
    + Skill
  </button>
</div>
<hr className="my-3 border-t border-gray-300" />


          {/* Languages Section */}
          <div className="mb-2">
  <h2 className="text-xl font-semibold text-gray-800">Languages Known</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
    {skills.languagesKnown.map((language, index) => (
      <div key={index} className="md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <input
              type="text"
              placeholder="e.g., English, Hindi"
              value={language.language}
              onChange={(e) => handleChange(e, "languagesKnown", index, "language")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2 flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
              <select
                value={language.proficiency}
                onChange={(e) => handleChange(e, "languagesKnown", index, "proficiency")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Fluent">Fluent</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
            <div className="flex items-end mb-1">
              <button
                type="button"
                onClick={() => removeEntry("languagesKnown", index)}
                className="text-gray-600 hover:text-red-800 text-sm font-bold border p-2 rounded "
              >
               X
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  <button
    type="button"
    onClick={() => addEntry("languagesKnown")}
    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-md text-sm transition duration-300"
  >
    + Language
  </button>
</div>




         {/* Submit Button */}
         <hr className="my-6 border-t border-gray-300" />

{/* Submit Section */}
<div className="text-center mt-6">
  <p className="mb-3 text-sm text-gray-600">Please review all your entries before updating.</p>
  <button
    type="submit"
    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
  >
    Update and Next
  </button>
</div>


        </form>
      </div>
    </div>
  );
};

export default UpdateSkills;