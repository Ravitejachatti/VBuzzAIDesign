// src/pages/CollegeInformation.jsx
import React, { useState } from "react";
import { Pencil, Save, X } from "lucide-react";

const CollegeInformation = ({ initialData = {}, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [collegeData, setCollegeData] = useState({
    collegeName: initialData.collegeName || "",
    collegeCode: initialData.collegeCode || "",
    deanName: initialData.deanName || "",
    establishedYear: initialData.establishedYear || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    website: initialData.website || "",
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zip: initialData.zip || "",
    vision: initialData.vision || "",
    mission: initialData.mission || "",
    about: initialData.about || "",
    totalDepartments: initialData.totalDepartments || 0,
    totalFaculty: initialData.totalFaculty || 0,
    totalStudents: initialData.totalStudents || 0,
    researchCenters: initialData.researchCenters || 0,
    facilities: initialData.facilities || [],
    accreditations: initialData.accreditations || [],
    achievements: initialData.achievements || [],
    partnerships: initialData.partnerships || [],
  });

  const handleChange = (field, value) => {
    setCollegeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleListChange = (field, index, value) => {
    const updated = [...collegeData[field]];
    updated[index] = value;
    setCollegeData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleAddToList = (field) => {
    setCollegeData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveFromList = (field, index) => {
    const updated = [...collegeData[field]];
    updated.splice(index, 1);
    setCollegeData((prev) => ({ ...prev, [field]: updated }));
  };

  const saveChanges = () => {
    if (onSave) onSave(collegeData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">College Information</h2>
        {isEditing ? (
          <div className="space-x-2">
            <button
              onClick={saveChanges}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={() => {
                setCollegeData(initialData);
                setIsEditing(false);
                if (onCancel) onCancel();
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            <Pencil size={16} /> Edit
          </button>
        )}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["collegeName", "College Name"],
          ["collegeCode", "College Code"],
          ["deanName", "Dean Name"],
          ["establishedYear", "Established Year"],
          ["email", "Email"],
          ["phone", "Phone Number"],
          ["website", "Website"],
          ["address", "Street Address"],
          ["city", "City"],
          ["state", "State"],
          ["zip", "ZIP Code"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium">{label}</label>
            {isEditing ? (
              <input
                type="text"
                value={collegeData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border rounded p-2"
              />
            ) : (
              <p>{collegeData[field]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="mt-6 space-y-4">
        {[
          ["vision", "Vision"],
          ["mission", "Mission"],
          ["about", "About College"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium">{label}</label>
            {isEditing ? (
              <textarea
                value={collegeData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
              />
            ) : (
              <p>{collegeData[field]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["totalDepartments", "Total Departments"],
          ["totalFaculty", "Total Faculty"],
          ["totalStudents", "Total Students"],
          ["researchCenters", "Research Centers"],
        ].map(([field, label]) => (
          <div
            key={field}
            className="p-4 bg-gray-100 rounded shadow text-center"
          >
            <h3 className="text-lg font-semibold">{label}</h3>
            {isEditing ? (
              <input
                type="number"
                value={collegeData[field]}
                onChange={(e) =>
                  handleChange(field, Number(e.target.value) || 0)
                }
                className="w-full border rounded p-1 text-center"
              />
            ) : (
              <p className="text-xl font-bold">{collegeData[field]}</p>
            )}
          </div>
        ))}
      </div>

      {/* List Sections */}
      {["facilities", "accreditations", "achievements", "partnerships"].map(
        (field) => (
          <div key={field} className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold capitalize">{field}</h3>
              {isEditing && (
                <button
                  onClick={() => handleAddToList(field)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Add
                </button>
              )}
            </div>
            {isEditing ? (
              collegeData[field].map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListChange(field, idx, e.target.value)
                    }
                    className="w-full border rounded p-2"
                  />
                  <button
                    onClick={() => handleRemoveFromList(field, idx)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <ul className="list-disc pl-5">
                {collegeData[field].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default CollegeInformation;