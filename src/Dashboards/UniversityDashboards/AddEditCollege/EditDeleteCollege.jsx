import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { fetchColleges,fetchCollegeById,addCollege,updateCollege,deleteCollege} from "../../../Redux/UniversitySlice";

const CollegeManagement = ({ departments }) => {
  const { universityName } = useParams(); // Get university name dynamically
  const location = useLocation(); // Access user data from state
  const user = location.state?.user || {}; // Extract user data from state
  
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalCollege, setOriginalCollege] = useState(null);

  
  const [showDepartmentsPopup, setShowDepartmentsPopup] = useState(false);
  const [currentCollegeDepartments, setCurrentCollegeDepartments] = useState([]);
  
  const [load,setLoad]=useState(false)
  const dispatch=useDispatch(); 
  const {colleges,loading}=useSelector(state=>state.colleges) 
  // Access the base URL from the .env file
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Retrieve token from localStorage
  const token = localStorage.getItem("University authToken");

  const fetchcolleges = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    console.log("unv2",universityName)
    const result = await dispatch(fetchColleges({token,universityName})) 
    if (result.meta.requestStatus === "fulfilled") {
       console.log("fetched")
  } else {
    setError( "Something went wrong.");
    
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
    dispatch(deleteCollege({token,collegeId,universityName}))
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

  // Compare and extract only changed fields
  const changes = {};
  for (const key in selectedCollege) {
    if (
      typeof selectedCollege[key] === 'object' &&
      selectedCollege[key] !== null &&
      originalCollege[key]
    ) {
      // Nested object (e.g., location)
      changes[key] = {};
      for (const subKey in selectedCollege[key]) {
        if (selectedCollege[key][subKey] !== originalCollege[key][subKey]) {
          changes[key][subKey] = selectedCollege[key][subKey];
        }
      }
      // Remove empty nested objects
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
    selectedCollege: {

      ...changes,
    },
  }));
};

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the field belongs to the location object
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1]; // Extract the field name (e.g., address, city)
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
  

  // Function to get department names from department IDs
  const getDepartmentNames = (departmentIds) => {
    return departmentIds.map((id) => {
      const department = departments.find((dept) => dept._id === id);
      return department ? department.name : "Unknown Department";
    });
  };

  // Function to handle "View Departments" button click
  const handleViewDepartments = (college) => {
    if (college.departments && college.departments.length > 0) {
      setCurrentCollegeDepartments(getDepartmentNames(college.departments));
      setShowDepartmentsPopup(true);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">College Management<button onClick={()=>{console.log(colleges)}}>hiihi</button></h2>
     
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
       <button onClick={()=>{console.log(colleges)}}></button>
      {/* College Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-xs">S.N.</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Name</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Dean</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Email</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Location</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Departments</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Created At</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Updated At</th>
              <th className="border border-gray-300 px-2 py-1 text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college, index) => (
              <tr key={college._id}>
                <td className="border border-gray-300 px-2 py-1 text-xs">{index + 1}</td>
                <td className="border border-gray-300 px-2 py-1 text-xs">{college.name}</td>
                <td className="border border-gray-300 px-2 py-1 text-xs">{college.dean}</td>
                <td className="border border-gray-300 px-2 py-1 text-xs">{college.adminEmail}</td>
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  {college.location && (
                    <>
                      <p><strong>Address:</strong> {college.location.address}</p>
                      <p><strong>City:</strong> {college.location.city}</p>
                      <p><strong>State:</strong> {college.location.state}</p>
                      <p><strong>Country:</strong> {college.location.country}</p>
                    </>
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  {college.departments && college.departments.length > 0 ? (
                    <>
                      <span>{college.departments.length}</span>
                      <button
                        onClick={() => handleViewDepartments(college)}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        View
                      </button>
                    </>
                  ) : (
                    "No departments"
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  {new Date(college.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  {new Date(college.updatedAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  <button
                    onClick={() => handleEdit(college._id)}
                    className="px-2 py-1 my-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(college._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    disabled={load}
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
          <div className="bg-white p-6 rounded shadow-md w-[600px]">
            <h3 className="text-lg font-bold mb-4">Edit College</h3>
            <label className="block text-sm font-medium">College Name</label>
            <input
              type="text"
              name="name"
              value={selectedCollege.name}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-4"
              placeholder="College Name"
            />
            <label className="block text-sm font-medium">Dean</label>
            <input
              type="text"
              name="dean"
              value={selectedCollege.dean}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-4"
              placeholder="Dean"
            />
            <label className="block text-sm font-medium">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={selectedCollege.adminEmail}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-4"
              placeholder="Admin Email"
            />
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location.address"
              value={selectedCollege.location?.address || ""}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-4"
              placeholder="Address"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCollege(null)}
                className="px-2 py-1 text-xs bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Departments Popup */}
      {showDepartmentsPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-2">Departments</h3>
            <ul>
              {currentCollegeDepartments.map((dept, index) => (
                <li key={index}>{index+1}.{dept}</li>
              ))}
            </ul>
            <div className="flex justify-end mt-1">
              <button
                onClick={() => setShowDepartmentsPopup(false)}
                className="px-2 py-1 text-xs bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeManagement;