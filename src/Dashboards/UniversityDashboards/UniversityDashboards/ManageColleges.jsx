import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const CollegeDashboard = () => {
  const { universityName } = useParams();
  const location = useLocation();
  const user = location.state?.user || {}; // Extract user data from state
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState(initialFormState(user.id, universityName));
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch colleges on mount
  useEffect(() => {
    fetchColleges();
  }, []);

  // Initial form state
  function initialFormState(universityId, universityName) {
    return {
      name: "",
      dean: "",
      country: "",
      state: "",
      city: "",
      address: "",
      adminEmail: "",
      adminPassword: "",
      university: universityId || "",
      universityName: universityName || "",
    };
  }

  // Fetch colleges API call
  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`
      );
      setColleges(response.data);
    } catch (err) {
      setError("Failed to fetch colleges.");
      console.error(err);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dean || !formData.adminEmail || !formData.adminPassword) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/college/addcollege?universityName=${formData.universityName}`,
        {
          ...formData,
          location: {
            country: formData.country,
            state: formData.state,
            city: formData.city,
            address: formData.address,
          },
        }
      );
      setSuccess("College added successfully!");
      fetchColleges(); // Refresh the list
      setFormData(initialFormState(user.id, universityName));
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while adding the college.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete college
  const handleDelete = async (collegeId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/college/colleges/${collegeId}?universityName=${universityName}`
      );
      setSuccess("College deleted successfully.");
      fetchColleges();
    } catch (err) {
      setError("Failed to delete the college.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit college
  const handleEdit = async (collegeId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges/${collegeId}?universityName=${universityName}`
      );
      setSelectedCollege(response.data);
    } catch (err) {
      setError("Failed to fetch college details for editing.");
      console.error(err);
    }
  };

  // Handle update college
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/college/colleges/${selectedCollege._id}?universityName=${universityName}`,
        selectedCollege
      );
      setSuccess("College updated successfully.");
      fetchColleges();
      setSelectedCollege(null);
    } catch (err) {
      setError("Failed to update the college.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedCollege((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">College Dashboard</h2>

      {/* Display User Details */}
      <div className="mb-4">
        <h3 className="font-medium text-lg">User Details</h3>
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Role:</strong> {user.role || "N/A"}</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Add College Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <h3 className="font-medium mb-2">Add College</h3>
        {Object.keys(formData).map((key) => (
          key !== "university" && key !== "universityName" &&
          <div className="mb-4" key={key}>
            <label htmlFor={key} className="block text-sm font-medium mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              id={key}
              name={key}
              type={key === "adminPassword" ? "password" : "text"}
              value={formData[key]}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add College"}
        </button>
      </form>

      {/* College List */}
      <h3 className="font-medium mb-4">Manage Colleges</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Dean</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college) => (
              <tr key={college._id}>
                <td className="border border-gray-300 px-4 py-2">{college.name}</td>
                <td className="border border-gray-300 px-4 py-2">{college.dean}</td>
                <td className="border border-gray-300 px-4 py-2">{college.adminEmail}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(college._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(college._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit College Modal */}
      {selectedCollege && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[600px] grid grid-cols-2 gap-4">
            <h3 className="col-span-2 text-lg font-bold mb-4">Edit College</h3>
            {Object.keys(selectedCollege).filter((key) => ["name", "dean", "country", "state", "city", "address", "adminEmail", "adminPassword"].includes(key)).map((key) => (
              <div className="mb-4" key={key}>
                <label className="block text-sm font-medium mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type="text"
                  name={key}
                  value={selectedCollege[key]}
                  onChange={handleModalChange}
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <div className="col-span-2 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCollege(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={loading}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;
