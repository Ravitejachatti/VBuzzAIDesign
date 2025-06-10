import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchColleges, fetchCollegeById, updateCollege, deleteCollege } from "../../../Redux/UniversitySlice";
import { FaEdit, FaTrash, FaEye, FaBuilding, FaUser, FaEnvelope, FaMapMarkerAlt, FaSearch, FaFilter } from "react-icons/fa";

const CollegeManagement = ({ departments }) => {
  const { universityName } = useParams();
  const location = useLocation();
  const user = location.state?.user || {};
  
  const dispatch = useDispatch();
  const { colleges, loading } = useSelector(state => state.colleges);
  
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [originalCollege, setOriginalCollege] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDepartmentsPopup, setShowDepartmentsPopup] = useState(false);
  const [currentCollegeDepartments, setCurrentCollegeDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [load, setLoad] = useState(false);

  const token = localStorage.getItem("University authToken");

  const fetchcolleges = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    const result = await dispatch(fetchColleges({ token, universityName }));
    if (result.meta.requestStatus === "fulfilled") {
      console.log("fetched");
    } else {
      setError("Something went wrong.");
    }
    setLoad(false);
  };

  useEffect(() => {
    fetchcolleges();
  }, [universityName]);

  const handleDelete = async (collegeId) => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this college?")) {
      dispatch(deleteCollege({ token, collegeId, universityName }));
    }
  };

  const handleEdit = async (collegeId) => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    const result = await dispatch(fetchCollegeById({ token, collegeId, universityName }));

    if (result.meta.requestStatus === "fulfilled") {
      setSelectedCollege(result.payload);
      setOriginalCollege(result.payload);
    } else {
      setError("Failed to fetch college details for editing.");
    }
  };

  const handleUpdate = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    const changes = {};
    for (const key in selectedCollege) {
      if (
        typeof selectedCollege[key] === 'object' &&
        selectedCollege[key] !== null &&
        originalCollege[key]
      ) {
        changes[key] = {};
        for (const subKey in selectedCollege[key]) {
          if (selectedCollege[key][subKey] !== originalCollege[key][subKey]) {
            changes[key][subKey] = selectedCollege[key][subKey];
          }
        }
        if (Object.keys(changes[key]).length === 0) {
          delete changes[key];
        }
      } else if (selectedCollege[key] !== originalCollege[key]) {
        changes[key] = selectedCollege[key];
      }
    }

    if (Object.keys(changes).length === 0) {
      alert("No changes made.");
      return;
    }

    dispatch(updateCollege({
      token,
      universityName,
      id: selectedCollege._id,
      selectedCollege: { ...changes },
    }));
    setSelectedCollege(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setSelectedCollege((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setSelectedCollege({ ...selectedCollege, [name]: value });
    }
  };

  const getDepartmentNames = (departmentIds) => {
    return departmentIds.map((id) => {
      const department = departments.find((dept) => dept._id === id);
      return department ? department.name : "Unknown Department";
    });
  };

  const handleViewDepartments = (college) => {
    if (college.departments && college.departments.length > 0) {
      setCurrentCollegeDepartments(getDepartmentNames(college.departments));
      setShowDepartmentsPopup(true);
    }
  };

  // Filter and sort colleges
  const filteredColleges = colleges
    .filter(college => 
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.dean.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "dean":
          return a.dean.localeCompare(b.dean);
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaBuilding className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">College Management</h1>
                <p className="text-gray-600">Manage colleges under {universityName}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total Colleges: <span className="font-semibold text-blue-600">{colleges.length}</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="dean">Sort by Dean</option>
                  <option value="createdAt">Sort by Date Created</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <div key={college._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaBuilding className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{college.name}</h3>
                      <p className="text-sm text-gray-500">College</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">Dean: {college.dean}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{college.adminEmail}</span>
                  </div>

                  {college.location && (
                    <div className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="text-gray-400 text-sm mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{college.location.address}</p>
                        <p>{college.location.city}, {college.location.state}</p>
                        <p>{college.location.country}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-gray-500">
                      Departments: {college.departments?.length || 0}
                      {college.departments && college.departments.length > 0 && (
                        <button
                          onClick={() => handleViewDepartments(college)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(college.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(college._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(college._id)}
                    disabled={load}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <FaBuilding className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No colleges found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new college."}
            </p>
          </div>
        )}

        {/* Edit College Modal */}
        {selectedCollege && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit College</h3>
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedCollege.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dean</label>
                    <input
                      type="text"
                      name="dean"
                      value={selectedCollege.dean}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={selectedCollege.adminEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="location.address"
                      value={selectedCollege.location?.address || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update College
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Departments Popup */}
        {showDepartmentsPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Departments</h3>
                  <button
                    onClick={() => setShowDepartmentsPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <ul className="space-y-2">
                  {currentCollegeDepartments.map((dept, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{dept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeManagement;