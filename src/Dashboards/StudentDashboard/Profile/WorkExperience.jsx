import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const UpdateExperience = ({ goToNext }) => {
  const { id } = useParams();
  const [workExperience, setWorkExperience] = useState([
    {
      companyName: "",
      position: "",
      duration: "",
      responsibilitiesAndAchievements: [""],
      skillsAcquired: [""],
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
    const fetchWorkExperience = async () => {
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
        if (studentData.workExperience && studentData.workExperience.length > 0) {
          setWorkExperience(studentData.workExperience.map(exp => ({
            ...exp,
            responsibilitiesAndAchievements: exp.responsibilitiesAndAchievements || [""],
            skillsAcquired: exp.skillsAcquired || [""]
          })));
        } else {
          setWorkExperience([{
            companyName: "",
            position: "",
            duration: "",
            responsibilitiesAndAchievements: [""],
            skillsAcquired: [""],
          }]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch work experience:", error);
        setMessage({ text: "Failed to fetch work experience.", type: "error" });
        setLoading(false);
      }
    };

    fetchWorkExperience();
  }, [studentId, universityName, token]);

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const updatedExperience = [...workExperience];
    updatedExperience[index][field] = value;
    setWorkExperience(updatedExperience);
  };

  const handleArrayItemChange = (e, index, arrayField, itemIndex) => {
    const { value } = e.target;
    const updatedExperience = [...workExperience];
    updatedExperience[index][arrayField][itemIndex] = value;
    setWorkExperience(updatedExperience);
  };

  const addArrayItem = (index, arrayField) => {
    const updatedExperience = [...workExperience];
    updatedExperience[index][arrayField].push("");
    setWorkExperience(updatedExperience);
  };

  const removeArrayItem = (index, arrayField, itemIndex) => {
    const updatedExperience = [...workExperience];
    updatedExperience[index][arrayField].splice(itemIndex, 1);
    setWorkExperience(updatedExperience);
  };

  const addExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        companyName: "",
        position: "",
        duration: "",
        responsibilitiesAndAchievements: [""],
        skillsAcquired: [""],
      },
    ]);
  };

  const removeExperience = (index) => {
    if (workExperience.length > 1) {
      const updatedExperience = workExperience.filter((_, i) => i !== index);
      setWorkExperience(updatedExperience);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedExperience = workExperience.map(exp => ({
        ...exp,
        responsibilitiesAndAchievements: exp.responsibilitiesAndAchievements.filter(item => item.trim() !== ""),
        skillsAcquired: exp.skillsAcquired.filter(item => item.trim() !== "")
      }));

      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-experience?universityName=${encodeURIComponent(universityName)}`,
        { workExperience: cleanedExperience },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ text: "Work experience updated successfully!", type: "success" });
      if (goToNext) goToNext();  // 👈 Navigate to next section
    } catch (error) {
      console.error("Failed to update work experience:", error);
      setMessage({ text: "Failed to update work experience.", type: "error" });
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
    <div className="mx-auto p-1">
      <div className="">
        <h1 className="text-lg md:text-xl font-bold text-gray-800 ">Update Work Experience:</h1>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="">
          {workExperience.map((experience, index) => (
            <div key={index} className="rounded-lg mb-2 p-4 shadow-sm divide-y">
            {/* Header */}
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {index + 1}. Experience
              </h2>
              {workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-gray-600 hover:text-red-800 text-sm  flex items-center border px-3 py-1 rounded-md font-bold"
                >
                X
                </button>
              )}
            </div>
          
            {/* Company, Position, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name*</label>
                <input
                  type="text"
                  value={experience.companyName}
                  onChange={(e) => handleChange(e, index, "companyName")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Google Inc."
                  required
                />
              </div>
          
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => handleChange(e, index, "position")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>
          
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
                <input
                  type="text"
                  value={experience.duration}
                  onChange={(e) => handleChange(e, index, "duration")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., June 2020 - Present"
                  required
                />
              </div>
            </div>
          
            {/* Responsibilities */}
            <div className="py-4">
  <div className="flex justify-between items-center mb-2">
    <label className="block text-sm font-medium text-gray-700">Responsibilities & Achievements</label>
    <button
      type="button"
      onClick={() => addArrayItem(index, "responsibilitiesAndAchievements")}
      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center border px-2 py-1 rounded"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      Add
    </button>
  </div>

  <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-3">
    {experience.responsibilitiesAndAchievements.map((item, itemIndex) => (
      <div key={itemIndex} className="flex items-start gap-2">
        <span className="mt-2 text-gray-500">{itemIndex + 1}.</span>
        <input
          type="text"
          value={item}
          onChange={(e) => handleArrayItemChange(e, index, "responsibilitiesAndAchievements", itemIndex)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Responsibility or achievement"
        />
        {experience.responsibilitiesAndAchievements.length > 1 && (
          <button
            type="button"
            onClick={() => removeArrayItem(index, "responsibilitiesAndAchievements", itemIndex)}
            className="text-red-500 hover:text-red-700 p-2 border rounded-md"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8h2v6H7V8zm4 0h2v6h-2V8z" clipRule="evenodd" />
                  </svg>
          </button>
        )}
      </div>
    ))}
  </div>
</div>

          
            {/* Skills Acquired */}
            <div className="py-4">
  <div className="flex justify-between items-center mb-2">
    <label className="text-sm font-medium text-gray-700">Skills Acquired</label>
    <button
      type="button"
      onClick={() => addArrayItem(index, "skillsAcquired")}
      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center border px-3 py-1 rounded"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      Add
    </button>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3">
    {experience.skillsAcquired.map((skill, skillIndex) => (
      <div key={skillIndex} className="flex items-center">
        <input
          type="text"
          value={skill}
          onChange={(e) => handleArrayItemChange(e, index, "skillsAcquired", skillIndex)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., React, Node.js"
        />
        {experience.skillsAcquired.length > 1 && (
          <button
            type="button"
            onClick={() => removeArrayItem(index, "skillsAcquired", skillIndex)}
            className="ml-2  text-gray-600 hover:text-red-800 p-2 border rounded-md font-bold"
          >
        X
          </button>
        )}
      </div>
    ))}
  </div>
</div>

          </div>
          
          ))}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={addExperience}
              className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Experience
            </button>

          </div>
          <div className="mt-6">
  <p className="text-sm text-gray-600 text-center mb-2">
    📌 <span className="font-medium">Read the details before updating and going to the next section.</span>
  </p>
  <div className="flex justify-center">
    <button
      type="submit"
      className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
    >
      Update and next
    </button>
  </div>
</div>

        </form>


      </div>
    </div>
  );
};

export default UpdateExperience;