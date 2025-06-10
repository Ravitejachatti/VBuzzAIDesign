import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector,useDispatch } from "react-redux";
import { addPlacement } from "../../../Redux/PlacementSlice";
const PlacementCellForm = ({ user }) => {
  const universityId = user?.universityId || ""; // Using user.id as universityId
  const { universityName } = useParams(); 
const dispatch = useDispatch()
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    designation: "",   
    email: "",
    password: "",
    phone: "",
    colleges: [], // Selected college IDs
    universityId: universityId, // Assign universityId from the user prop
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);


  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("University authToken");

  // Fetch colleges based on universityName

  useEffect(() => {
    fetchColleges();
  }, [universityName]);

  const fetchColleges = async () => {
    try {
      console.log("universityName:", universityName);
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setColleges(response.data);
      console.log("Colleges fetched:", response.data);
    } catch (err) {
      setError("Failed to fetch colleges.");
      console.error(err);
    }
  };

  console.log("Colleges:", colleges);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes for colleges
  const handleCollegeChange = (collegeId) => {
    setFormData((prevData) => ({
      ...prevData,
      colleges: prevData.colleges.includes(collegeId)
        ? prevData.colleges.filter((id) => id !== collegeId) // Remove if already selected
        : [...prevData.colleges, collegeId], // Add if not selected
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res =  await dispatch(addPlacement({token,formData,universityName}))

    if (res.meta.requestStatus === "fulfilled") {
    
       setSuccess("added success")
  } else {
    setError( "Something went wrong.");
    
  }
      setLoading(false)
  };
  

  return (
   <div className="p-6 mx-auto">
  <h2 className="text-2xl font-bold mb-4">Create Placement Cell</h2>
  {error && <p className="text-red-500 mb-4">{error}</p>}
  {success && <p className="text-green-500 mb-4">{success}</p>}

  <form onSubmit={handleSubmit}>
    <div
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {/* Placement Cell Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Placement Cell Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          placeholder="Enter placement cell name"
          required
        />
      </div>

      {/* Head of Placement Cell */}
      <div>
        <label htmlFor="head" className="block text-sm font-medium mb-1">
          Head of Placement Cell
        </label>
        <input
          id="head"
          name="head"
          type="text"
          value={formData.head}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          placeholder="Enter head's name"
          required
        />
      </div>
      {/* designation */}

<div>
        <label htmlFor="designation" className="block text-sm font-medium mb-1">
          Designation 
          </label>
          <input 
          id="designation"
          name="designation"
          type="text"
          value={formData.designation}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          placeholder="Enter head's name"
          required
          />
      </div> 

      {/* Contact Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Contact Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          placeholder="Enter contact email"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-4 relative">
  <label htmlFor="password" className="block text-sm font-medium mb-1">
    Password
  </label>
  <input
    id="password"
    name="password"
    type={showAdminPassword ? "text" : "password"}
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="p-2 border rounded-md w-full"
    placeholder="Enter password"
    required
  />
  <button
    type="button"
    className="absolute inset-y-0 right-2 top-5 flex items-center pr-3 focus:outline-none"
    onClick={() => setShowAdminPassword(!showAdminPassword)}
    aria-label={showAdminPassword ? "Hide password" : "Show password"}
  >
    {showAdminPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

      {/* Contact Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Contact Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          placeholder="Enter contact phone"
          required
        />
      </div>
    </div>
    {/* College Selection */}
    <div>
  <label className="block  font-semibold mb-2 mt-3">Associate Colleges</label>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 text-xs">
    {colleges.map((college) => (
      <div key={college._id} className="flex items-center mb-2">
        <input
          id={college._id}
          type="checkbox"
          checked={formData.colleges.includes(college._id)}
          onChange={() => handleCollegeChange(college._id)}
          className="mr-2"
        />
        <label htmlFor={college._id} className="text-sm">
          {college.name}
        </label>
      </div>
    ))}
  </div>
</div>


    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mt-4"
      disabled={loading}
    >
      {loading ? "Submitting..." : "Create Placement Cell"}
    </button>
  </form>
</div>

  );
};

export default PlacementCellForm;
