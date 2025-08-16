import React, { useState } from "react";
import {
  Pencil,
  Save,
  X,
  Plus,
  Trash2,
  GraduationCap,
  Users,
  BookOpen,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  Target,
  Eye,
  Info
} from "lucide-react";

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
    partnerships: initialData.partnerships || []
  });

  const handleChange = (field, value) => {
    setCollegeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleListChange = (field, index, value) => {
    const list = [...collegeData[field]];
    list[index] = value;
    setCollegeData((prev) => ({ ...prev, [field]: list }));
  };

  const handleAddToList = (field) => {
    setCollegeData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveFromList = (field, index) => {
    const list = [...collegeData[field]];
    list.splice(index, 1);
    setCollegeData((prev) => ({ ...prev, [field]: list }));
  };

  const saveChanges = () => {
    if (onSave) onSave(collegeData);
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setCollegeData(initialData);
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const statsConfig = [
    { field: "totalDepartments", label: "Total Departments", icon: Building },
    { field: "totalFaculty", label: "Total Faculty", icon: Users },
    { field: "totalStudents", label: "Total Students", icon: GraduationCap },
    { field: "researchCenters", label: "Research Centers", icon: BookOpen }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="h-8 w-8" />
            College Information
          </h1>
          <p className="text-blue-100">Manage your institution's details</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded flex items-center text-white"
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </button>
              <button
                onClick={cancelChanges}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded flex items-center text-white"
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded flex items-center"
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsConfig.map(({ field, label, icon: Icon }) => (
          <div key={field} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={collegeData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="mt-1 p-2 border rounded w-20"
                  />
                ) : (
                  <p className="text-2xl font-bold">{collegeData[field]}</p>
                )}
              </div>
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" /> Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["collegeName", "collegeCode", "deanName", "establishedYear"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={collegeData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{collegeData[field] || "Not specified"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" /> Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["email", "phone", "website"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={collegeData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{collegeData[field] || "Not specified"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" /> Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["address", "city", "state", "zip"].map((field) => (
            <div key={field} className={field === "address" ? "md:col-span-3" : ""}>
              <label className="block text-sm font-medium capitalize">{field}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={collegeData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 rounded">{collegeData[field] || "Not specified"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vision, Mission, About */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["vision", "mission", "about"].map((field) => (
          <div key={field} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold capitalize">{field}</h3>
            {isEditing ? (
              <textarea
                value={collegeData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                rows="4"
              />
            ) : (
              <p className="mt-1 text-gray-600">{collegeData[field] || "Not specified"}</p>
            )}
          </div>
        ))}
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["facilities", "accreditations", "achievements", "partnerships"].map((field) => (
          <div key={field} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold capitalize">{field}</h3>
              {isEditing && (
                <button
                  onClick={() => handleAddToList(field)}
                  className="px-2 py-1 bg-blue-500 text-white rounded flex items-center"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                {collegeData[field].map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange(field, idx, e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() => handleRemoveFromList(field, idx)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc pl-5 text-gray-600">
                {collegeData[field].length > 0 ? (
                  collegeData[field].map((item, idx) => <li key={idx}>{item}</li>)
                ) : (
                  <li>No {field} specified</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeInformation;