import React, { useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { addCollege } from "../../../Redux/UniversitySlice";
import { useDispatch,useSelector } from "react-redux";

const AddColleges = () => {
  const { universityName } = useParams(); // Get dynamic university name
  const location = useLocation(); // Access user data from state
  const user = location.state?.user || {}; // Extract user data from state

  
  console.log("printing the user", user)
  console.log("user universityId", user.universityId)

  // Access the base URL from the .env file
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const dispatch=useDispatch(); 
  const [formData, setFormData] = useState({
    name: "",
    dean: "",
    country: "",
    state: "",
    city: "",
    address: "",
    adminEmail: "",
    adminPassword: "",
    university: user.universityId || "", // Use user ID for university
    universityName: universityName || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {colleges,loading} = useSelector(state=>state.colleges)
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [load,setLoad] = useState(false)
  const token = localStorage.getItem("University authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);

    if (!formData.name || !formData.dean || !formData.adminEmail || !formData.adminPassword) {
      setError("All fields are required.");
      return;
    }

    
   setLoad(true);
       const result = await dispatch(addCollege({token,formData}))
       if (result.meta.requestStatus === "fulfilled") {
    setSuccess("College added successfully!");
    setFormData({
      name: "",
      dean: "",
      country: "",
      state: "",
      city: "",
      address: "",
      adminEmail: "",
      adminPassword: "",
      university: user.universityId || "",
      universityName: universityName || "",
    });
  } else {
    setError( "Something went wrong.");
  }

  setLoad(false);
       
       
      
    
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-1 text-center">Add College</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* College Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              College Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter college name"
              className="p-2 border rounded-md w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Dean */}
          <div className="mb-4">
            <label htmlFor="dean" className="block text-sm font-medium mb-1">
              Dean
            </label>
            <input
              id="dean"
              name="dean"
              type="text"
              placeholder="Enter dean's name"
              className="p-2 border rounded-md w-full"
              value={formData.dean}
              onChange={handleChange}
            />
          </div>

          {/* Location Fields */}
          {["country", "state", "city", "address"].map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="block text-sm font-medium mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type="text"
                placeholder={`Enter ${field}`}
                className="p-2 border rounded-md w-full"
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Admin Email */}
          <div className="mb-4">
            <label htmlFor="adminEmail" className="block text-sm font-medium mb-1">
              Admin Email
            </label>
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              placeholder="Enter admin email"
              className="p-2 border rounded-md w-full"
              value={formData.adminEmail}
              onChange={handleChange}
            />
          </div>

          {/* Admin Password */}
       

            <div className="mb-4 relative">
              <label htmlFor="adminPassword" className="block text-sm font-medium mb-1">
                Admin Password
              </label>
              <input
                id="adminPassword"
                name="adminPassword"
                type={showAdminPassword ? "text" : "password"}
                placeholder="Enter admin password"
                className="p-2 border rounded-md w-full"
                value={formData.adminPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 top-6 flex items-center pr-3 focus:outline-none"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
              >
                {showAdminPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

      

          {/* University ID */}
          <div className="mb-4">
            <label className="block text-gray-700">University ID</label>
            <input
              type="text"
              value={formData.university}
              className="mt-1 p-2 w-full border rounded bg-gray-100"
              readOnly
            />
          </div>

          {/* University Name */}
          <div className="mb-4">
            <label className="block text-gray-700">University Name</label>
            <input
              type="text"
              value={formData.universityName}
              className="mt-1 p-2 w-full border rounded bg-gray-100"
              readOnly
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
        >
          {load ? "Submitting..." : "Add College"}
        </button>
      </form>
    </div>

  );
};

export default AddColleges;
