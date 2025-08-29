import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEducationDetails,
  updateEducationDetails,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/educationDetailsSlice";
import { useParams, useLocation } from "react-router-dom";

// Memoized InputField
const InputField = React.memo(
  ({ label, name, value, onChange, type = "text", placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  )
);

// Memoized EducationSection
const EducationSection = React.memo(
  ({ title, data, setData, fields, handleChange }) => (
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
  )
);

// Helper to get only changed fields (sends whole nested object/array if any part changes)
function getChangedFields(initial, current) {
  const changed = {};
  for (const key in current) {
    if (
      typeof current[key] === "object" &&
      current[key] !== null &&
      !Array.isArray(current[key])
    ) {
      // For nested objects, send the whole object if any property changes
      if (JSON.stringify(current[key]) !== JSON.stringify(initial?.[key] || {})) {
        changed[key] = current[key];
      }
    } else if (Array.isArray(current[key])) {
      // For arrays, send the whole array if any change
      if (JSON.stringify(current[key]) !== JSON.stringify(initial?.[key] || [])) {
        changed[key] = current[key];
      }
    } else {
      if (current[key] !== (initial?.[key] ?? "")) {
        changed[key] = current[key];
      }
    }
  }
  return changed;
}

const UpdateEducationDetails = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const studentDataFromLocation =
    location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId =
    studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  const { data, loading, error, updateStatus } = useSelector(
    (state) => state.educationDetails
  );

  const [tenth, setTenth] = useState({});
  const [twelfth, setTwelfth] = useState({});
  const [bachelors, setBachelors] = useState({});
  const [masters, setMasters] = useState({});
  const [phd, setPhd] = useState({});
  const [customEducationSchema, setCustomEducationSchema] = useState([]);

  const [certification, setCertification] = useState([]);
  
  const [initialEducation, setInitialEducation] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch education details from Redux
  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(
        fetchEducationDetails({ studentId, universityName, token, BASE_URL })
      );
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  // Set local state when data is fetched
  useEffect(() => {
    if (data) {
      setTenth(data.tenth || {});
      setTwelfth(data.twelfth || {});
      setBachelors(data.bachelors || {});
      setMasters(data.masters || {});
      setPhd(data.phd || {});
      setCustomEducationSchema(data.customEducationSchema || []);
      setCertification(data.certification || []);
      setInitialEducation({
        tenth: data.tenth || {},
        twelfth: data.twelfth || {},
        bachelors: data.bachelors || {},
        masters: data.masters || {},
        phd: data.phd || {},
        customEducationSchema: data.customEducationSchema || [],
        certification: data.certification || [],
      });
    }
  }, [data]);

  const handleChange = useCallback((e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCertificationChange = useCallback((index, field, value) => {
    setCertification((prev) =>
      prev.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert))
    );
  }, []);


  const handleCustomEducationChange = useCallback((index, field, value) => {
  setCustomEducationSchema((prev) =>
    prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
  );
}, []);


const addCustomEducation = () => {
  setCustomEducationSchema((prev) => [
    ...prev,
    {
      institutionName: "",
      degree: "",
      fieldOfStudy: "",
      yearOfCompletion: "",
      percentageOrCGPA: "",
      registrationNumber: "",
      notableAchievements: "",
    },
  ]);
};

const removeCustomEducation = (index) => {
  setCustomEducationSchema((prev) => prev.filter((_, i) => i !== index));
};


  const addCertification = () => {
    setCertification((prev) => [
      ...prev,
      {
        institutionName: "",
        courseName: "",
        completionYear: "",
        percentageOrCGPA: "",
        certificationLink: "",
      },
    ]);
  };

  const removeCertification = (index) => {
    setCertification((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialEducation) return;
    const current = { tenth, twelfth, bachelors, masters, phd, customEducationSchema , certification };
    const changedFields = getChangedFields(initialEducation, current);
    console.log("Changed Fields:", changedFields);
    if (Object.keys(changedFields).length === 0) {
      setMessage({ text: "No changes to update.", type: "error" });
      return;
    }
    dispatch(
      updateEducationDetails({
        studentId,
        universityName,
        token,
        BASE_URL,
        educationDetails: changedFields,
      })
    );
    // console the result after the updates
    setMessage({ text: "Updating education details...", type: "info" });
    alert("Updating education details...");
    console.log("Updating education details with:", changedFields);

  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({
        text: "Education details updated successfully!",
        type: "success",
      });
      alert("Education details updated successfully!");
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update education details.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading education details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4  mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Education Details</h1>

      {message.text && (
        <div
          className={`p-3 rounded-md mb-6 ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
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

            <EducationSection
          title="PHD"
          data={phd}
          setData={setPhd}
          handleChange={handleChange}
          fields={[
            { name: "institutionName", label: "Institution Name" },
            { name: "university", label: "University" },
            { name: "specialization", label: "Specialization" },
            { name: "thesisTitle", label: "Thesis Title" },
            { name: "supervisor", label: "Supervisor" },
            { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
            { name: "percentageOrCGPA", label: "Percentage/CGPA" },
            { name: "registrationNumber", label: "Registration Number" },
            { name: "notableAchievements", label: "Notable Achievements" },
          ]}
        />
               <div>
          <h2 className="text-xl font-semibold mb-4">Extra Coursework</h2>
          {customEducationSchema?.map((entry, index) => (
            <div
              key={index}
              className="p-4 mb-4 border border-gray-200 rounded bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["institutionName", "degree", "fieldOfStudy", "yearOfCompletion", "percentageOrCGPA", "registrationNumber", "notableAchievements"].map((field) => (
                  <InputField
                    key={field}
                    name={field}
                    label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    type={field === "yearOfCompletion" ? "number" : "text"}
                    value={entry[field]}
                    onChange={(e) =>
                      handleCustomEducationChange(index, field, e.target.value)
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeCustomEducation(index)}
                className="text-sm text-red-600 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCustomEducation}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Extra Coursework
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Certifications</h2>
          {certification.map((cert, index) => (
            <div
              key={index}
              className="p-4 mb-4 border border-gray-200 rounded bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "institutionName",
                  "courseName",
                  "completionYear",
                  "percentageOrCGPA",
                  "certificationLink",
                ].map((field) => (
                  <InputField
                    key={field}
                    name={field}
                    label={field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                    type={field === "completionYear" ? "number" : "text"}
                    value={cert[field]}
                    onChange={(e) =>
                      handleCertificationChange(index, field, e.target.value)
                    }
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






