import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const UpdatePersonalDetails = ({ goToNext }) => {
  const { id } = "67c0400cba2e166b5f84f657";
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    gender: "",
    registered_number: "",
    enrollment_year: "",
    graduation_year: "",
    dateOfBirth: "",
    category: "",
    nationality: "",
    bloodGroup: "",
    caste: "",
    futurePlan: [],
    Bio: "",
    isPlacementOpted: false,
    disability: {
      hasDisability: false,
      type: "",
      severity: "",
      disabilityPercentage: 0,
      supportRequired: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const location = useLocation();
  const [studentData, setStudentData] = useState({});

  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const studentData = response?.data?.student;
        setStudentData(studentData);
        setPersonalDetails({
          ...studentData,
          dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.split("T")[0] : "",
          futurePlan: studentData.futurePlan || [],
          disability: studentData.disability || {
            hasDisability: false,
            type: "",
            severity: "",
            disabilityPercentage: 0,
            supportRequired: ""
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch personal details:", error);
        setMessage("Failed to fetch personal details.");
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, [studentId, universityName, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("disability.")) {
      const disabilityField = name.split(".")[1];
      setPersonalDetails(prev => ({
        ...prev,
        disability: {
          ...prev.disability,
          [disabilityField]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setPersonalDetails(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleFuturePlanChange = (e) => {
    const { value, checked } = e.target;
    setPersonalDetails(prev => {
      if (checked) {
        return {
          ...prev,
          futurePlan: [...prev.futurePlan, value]
        };
      } else {
        return {
          ...prev,
          futurePlan: prev.futurePlan.filter(plan => plan !== value)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
        personalDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Personal details updated successfully!");
      alert("Personal details updated successfully!");
      if (goToNext) goToNext(); // 👉 Navigate to next section
    } catch (error) {
      console.error("Failed to update personal details:", error);
      setMessage("Failed to update personal details.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto">
      <h1 className="text-xl font-semibold">Update Personal Details</h1>
      {message && (
        <p className={`mb-1 p-2 rounded ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-1">  
          <div className="md:col-span-4 w-full border-t border-gray-300 pt-1 mt-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Placement Preference
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPlacementOpted"
              checked={personalDetails.isPlacementOpted || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPlacementOpted" className="ml-2 block text-sm text-gray-700">
              Opted for Placement
            </label>
          </div>
        </div>
              {/* Future Plans Section */}
        <div className="md:col-span-4 w-full border-t border-gray-300 pt-1 mt-2">
          <h3 className="text-md font-medium mb-2">Future Plans</h3>


          {/* future plans */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['Higher Studies', 'Government Job', 'Private Job', 'Entrepreneurship', 'Business',].map(plan => (
              <div key={plan} className="flex items-center">
                <input
                  type="checkbox"
                  id={`futurePlan-${plan}`}
                  value={plan}
                  checked={personalDetails.futurePlan?.includes(plan) || false}
                  onChange={handleFuturePlanChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`futurePlan-${plan}`} className="ml-2 block text-sm text-gray-700">
                  {plan}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Opt-in Section */}
    

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 border-t border-gray-300 pt-1 mt-2">
          {/* Read-only fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={studentData?.name || ""}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
            <input
              type="text"
              name="surname"
              value={personalDetails.surname || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={studentData?.email || ""}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={studentData?.phone || ""}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={personalDetails.gender || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={personalDetails.dateOfBirth || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
            <input
              type="text"
              name="category"
              value={personalDetails.category || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Caste</label>
            <input
              type="text"
              name="caste"
              value={personalDetails.caste || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={personalDetails.nationality || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={personalDetails.bloodGroup || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

      

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered Number</label>
            <input
              type="text"
              name="registered_number"
              value={personalDetails.registered_number || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
            <input
              type="number"
              name="enrollment_year"
              value={personalDetails.enrollment_year || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduation_year"
              value={personalDetails.graduation_year || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="md:col-span-4 w-full border-t border-gray-300 pt-4 mt-2">
          <h3 className="text-md font-medium mb-2">Professional Summary</h3>
          <textarea
            name="Bio"
            value={personalDetails.Bio || ""}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>


        {/* Disability Section */}
        <div className="border-t pt-6 mt-2">
          <h2 className="text-lg font-medium mb-4">Disability Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="disability.hasDisability"
                checked={personalDetails.disability?.hasDisability || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Has Disability
              </label>
            </div>

            {personalDetails.disability?.hasDisability && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disability Type</label>
                  <input
                    type="text"
                    name="disability.type"
                    value={personalDetails.disability.type || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    name="disability.severity"
                    value={personalDetails.disability.severity || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Severity</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disability Percentage</label>
                  <input
                    type="number"
                    name="disability.disabilityPercentage"
                    min="0"
                    max="100"
                    value={personalDetails.disability.disabilityPercentage || 0}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Required</label>
                  <textarea
                    name="disability.supportRequired"
                    value={personalDetails.disability.supportRequired || ""}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/* Submit Button with Line and Note */}
<div className="w-full border-t border-gray-300 pt-2 mt-2">
  <p className="text-center text-sm text-gray-600">
    Check the information clearly before updating and going to the next section.
  </p>
  <div className="flex justify-center mb-2">
    
    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Update & Next
    </button>
  </div>
  
</div>

      </form>

    </div>
  );
};

export default UpdatePersonalDetails;