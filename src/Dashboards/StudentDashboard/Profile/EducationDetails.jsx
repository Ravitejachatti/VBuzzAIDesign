import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

// Memoized InputField
const InputField = React.memo(({ label, name, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
));

// Memoized EducationSection
const EducationSection = React.memo(({ title, data, setData, fields, handleChange }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {fields.map(({ name, label, type, placeholder }) => (
        <InputField
          key={name}
          name={name}
          label={label}
          type={type}
          value={data[name] || ""}
          onChange={(e) => handleChange(e, setData)}
          placeholder={placeholder}
        />
      ))}
    </div>
  </div>
));

const UpdateEducationDetails = ({ goToNext }) => {
  const [tenth, setTenth] = useState({});
  const [twelfth, setTwelfth] = useState({});
  const [bachelors, setBachelors] = useState({});
  const [masters, setMasters] = useState({});
  const [certification, setCertification] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const location = useLocation();
  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  useEffect(() => {
    const fetchEducationDetails = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.student;
        console.log("Fetched education details:", data);
        setTenth(data.tenth || {});
        setTwelfth(data.twelfth || {});
        setBachelors(data.bachelors || {});
        setMasters(data.masters || {});
        setCertification(data.certification || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching education details:", error);
        setMessage({ text: "Failed to load education details.", type: "error" });
        setLoading(false);
      }
    };

    fetchEducationDetails();
  }, [studentId, universityName, token]);

  const handleChange = useCallback((e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCertificationChange = useCallback((index, field, value) => {
    setCertification((prev) =>
      prev.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert))
    );
  }, []);

  const addCertification = () => {
    setCertification((prev) => [
      ...prev,
      { institutionName: "", courseName: "", completionYear: "", percentageOrCGPA: "" },
    ]);
  };

  const removeCertification = (index) => {
    setCertification((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting education details:", {
      tenth,
      twelfth,
      bachelors,
      masters,
      certification,
    });
    try {
      const payload = { tenth, twelfth, bachelors, masters, certification };
      await axios.put(
        `${BASE_URL}/student/${studentId}/update-education?universityName=${encodeURIComponent(universityName)}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: "Education details updated successfully!", type: "success" });
      if (goToNext) goToNext();
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ text: "Failed to update education details.", type: "error" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading education details...</div>;
  }

  return (
    <div className="p-4  mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Education Details</h1>

      {message.text && (
        <div
          className={`p-3 rounded-md mb-6 ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <EducationSection
          title="10th Grade"
          data={tenth}
          setData={setTenth}
          handleChange={handleChange}
          fields={[
            { name: "institutionName", label: "Institution Name" },
            { name: "board", label: "Board" },
            { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
            { name: "percentageOrCGPA", label: "Percentage/CGPA" },
            { name: "notableAchievements", label: "Notable Achievements" },
          ]}
        />

        <EducationSection
          title="12th Grade"
          data={twelfth}
          setData={setTwelfth}
          handleChange={handleChange}
          fields={[
            { name: "institutionName", label: "Institution Name" },
            { name: "board", label: "Board" },
            { name: "stream", label: "Stream" },
            { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
            { name: "percentageOrCGPA", label: "Percentage/CGPA" },
            { name: "notableAchievements", label: "Notable Achievements" },
          ]}
        />

        <EducationSection
          title="Bachelor's Degree"
          data={bachelors}
          setData={setBachelors}
          handleChange={handleChange}
          fields={[
            { name: "institutionName", label: "Institution Name" },
            { name: "university", label: "University" },
            { name: "degree", label: "Degree" },
            { name: "specialization", label: "Specialization" },
            { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
            { name: "percentageOrCGPA", label: "Percentage/CGPA" },
            { name: "registrationNumber", label: "Registration Number" },
            { name: "notableAchievements", label: "Notable Achievements" },
          ]}
        />
        <EducationSection
          title="Master's Degree"
          data={masters}
          setData={setMasters}
          handleChange={handleChange}
          fields={[
            { name: "institutionName", label: "Institution Name" },
            { name: "university", label: "University" },
            { name: "degree", label: "Degree" },
            { name: "specialization", label: "Specialization" },
            { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
            { name: "percentageOrCGPA", label: "Percentage/CGPA" },
            { name: "registrationNumber", label: "Registration Number" },
            { name: "notableAchievements", label: "Notable Achievements" },
          ]}
        />

        <div>
          <h2 className="text-xl font-semibold mb-4">Certifications</h2>
          {certification.map((cert, index) => (
            <div key={index} className="p-4 mb-4 border border-gray-200 rounded bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["institutionName", "courseName", "completionYear", "percentageOrCGPA"].map((field) => (
                  <InputField
                    key={field}
                    name={field}
                    label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    type={field === "completionYear" ? "number" : "text"}
                    value={cert[field]}
                    onChange={(e) => handleCertificationChange(index, field, e.target.value)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-sm text-red-600 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCertification}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Certification
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Update & Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEducationDetails;
