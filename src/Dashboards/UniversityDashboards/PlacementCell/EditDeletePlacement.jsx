import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlacements, deletePlacement, updatePlacements } from "../../../Redux/PlacementSlice";
import { FaEdit, FaTrash, FaEye, FaBriefcase, FaUser, FaEnvelope, FaPhone, FaBuilding, FaSearch, FaFilter } from "react-icons/fa";

const EditDeletePlacement = ({ user, colleges }) => {
  const universityId = user?.id || "";
  const { universityName } = useParams();
  const dispatch = useDispatch();
  const { placements, loading } = useSelector(state => state.placements);

  const [originalForm, setOriginalForm] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    head: "",
    email: "",
    password: "",
    phone: "",
    colleges: [],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlacementId, setCurrentPlacementId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAllPlacements = async () => {
    const token = localStorage.getItem("University authToken");
    dispatch(fetchPlacements({ token, universityName }));
  };

  useEffect(() => {
    fetchAllPlacements();
  }, [universityName]);

  const openEditPopup = (placement) => {
    const orig = {
      name: placement.name,
      head: placement.head,
      email: placement.email,
      phone: placement.phone,
      password: placement.password ?? "",
      colleges: placement.colleges.map(c => c._id.toString()),
    };
    setOriginalForm(orig);
    setEditForm(orig);
    setCurrentPlacementId(placement._id);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleCollegeCheckboxChange = (collegeId) => {
    const selectedColleges = [...editForm.colleges];
    if (selectedColleges.includes(collegeId)) {
      setEditForm({
        ...editForm,
        colleges: selectedColleges.filter((id) => id !== collegeId),
      });
    } else {
      setEditForm({ ...editForm, colleges: [...selectedColleges, collegeId] });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("University authToken");
    const patchData = {};

    Object.keys(editForm).forEach(key => {
      const origVal = originalForm[key];
      const currVal = editForm[key];

      if (key === "password") {
        if (currVal && currVal.trim() !== "") {
          patchData.password = currVal;
        }
        return;
      }

      const changed = Array.isArray(currVal)
        ? JSON.stringify(currVal) !== JSON.stringify(origVal)
        : currVal !== origVal;

      if (changed) patchData[key] = currVal;
    });

    if (Object.keys(patchData).length === 0) {
      setIsEditing(false);
      return;
    }

    dispatch(updatePlacements({ token, id: currentPlacementId, patchData, universityName }));
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("University authToken");
    if (window.confirm("Are you sure you want to delete this placement cell?")) {
      dispatch(deletePlacement({ token, id, universityName }));
    }
  };

  // Filter and sort placements
  const filteredPlacements = placements
    .filter(placement => 
      placement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "head":
          return a.head.localeCompare(b.head);
        case "email":
          return a.email.localeCompare(b.email);
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
                <FaBriefcase className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Placement Cell Management</h1>
                <p className="text-gray-600">Manage placement cells under {universityName}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total Placement Cells: <span className="font-semibold text-blue-600">{placements.length}</span>
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
                  placeholder="Search placement cells..."
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
                  <option value="head">Sort by Head</option>
                  <option value="email">Sort by Email</option>
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

        {/* Placement Cells Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlacements.map((placement) => (
            <div key={placement._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaBriefcase className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{placement.name}</h3>
                      <p className="text-sm text-gray-500">Placement Cell</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">Head: {placement.head}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{placement.email}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{placement.phone}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <FaBuilding className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-600">
                        Colleges: {placement.colleges?.length || 0}
                      </span>
                    </div>
                    {placement.colleges && placement.colleges.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {placement.colleges.slice(0, 2).map((college, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {college.name}
                            </span>
                          ))}
                          {placement.colleges.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{placement.colleges.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openEditPopup(placement)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(placement._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlacements.length === 0 && (
          <div className="text-center py-12">
            <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No placement cells found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating a new placement cell."}
            </p>
          </div>
        )}

        {/* Edit Placement Cell Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Placement Cell</h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Placement Cell Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="head" className="block text-sm font-medium text-gray-700 mb-1">
                        Head Name
                      </label>
                      <input
                        id="head"
                        name="head"
                        type="text"
                        value={editForm.head}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Colleges</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {colleges?.map(c => (
                        <div key={c._id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.colleges.includes(c._id)}
                            onChange={() => handleCollegeCheckboxChange(c._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                          />
                          <label className="text-sm text-gray-700">{c?.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Update Placement Cell"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDeletePlacement;