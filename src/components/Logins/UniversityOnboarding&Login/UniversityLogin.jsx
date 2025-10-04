<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UniversityLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Access the base URL from the .env file
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://vbuzzinternational-705795435794.us-central1.run.app/api/user/login?universityName=${universityName}`,
        {
          email,
          password,
        }
      );

      const { message, token, user } = response.data;

      // Save token and user info to localStorage
      localStorage.setItem("University authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("universityAuth", "true");
      //universityid
    

      // Store placementName permanently in localStorage for PlacementAdmin
      if (user.role === "PlacementAdmin" && user.placementname) {
        localStorage.setItem("placementName", user.placementname);
      }

      if (user.role === "PlacementDirector" && user.name){
        localStorage.setItem("placementDirectorName", user.name)
      }

      window.dispatchEvent(new Event("storage"));

      alert(user.role + " has " + message);

      // Role-based navigation with response passed as props
      const { role } = user;
      const loginState = { state: { user, token, message } };
      console.log("loginState:", loginState);

      switch (role) {
        case "UniversityAdmin":
          navigate(`/dashboard/${universityName}`, loginState);
          break;
          
        case "PlacementDirector":
          navigate(`/dashboard/${universityName}//placementDirector/${user.placementDirectorName}`, loginState)
          break;

        case "PlacementAdmin":
          navigate(
            `/dashboard/${universityName}/placement/${user.placementname}`,
=======
// Import React and hooks
import React, { useState } from "react";                                   // React + local state hooks
import { useNavigate } from "react-router-dom";                            // Router navigation hook
import axios from "axios";                                                 // HTTP client
import { FaEye, FaEyeSlash } from "react-icons/fa";                        // Eye icons for password toggle

// Component: UniversityLogin
const UniversityLogin = () => {                                            // Define the login component
  // Local form state
  const [email, setEmail] = useState("");                                  // Email input state
  const [password, setPassword] = useState("");                            // Password input state
  const [universityName, setUniversityName] = useState("");                // University name (in URL query)
  const [error, setError] = useState("");                                   // Error banner state
  const [showPassword, setShowPassword] = useState(false);                 // Toggle for password visibility

  // Router navigate
  const navigate = useNavigate();                                          // Hook to programmatically navigate

  // API base URL from Vite ENV
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;                      // Read API base URL from env

  // Submit handler
  const handleLogin = async (e) => {                                       // Async submit handler
    e.preventDefault();                                                    // Prevent default form submit
    setError("");                                                          // Clear any previous error

    // (Optional) light validation
    const uni = universityName.trim();                                     // Trim universityName for safety
    if (!BASE_URL) {                                                       // Ensure BASE_URL exists
      setError("API base URL is not configured.");                         // Show config error
      return;                                                              // Stop
    }
    if (!uni) {                                                            // Ensure university provided
      setError("Please enter your University Name.");                      // Show user error
      return;                                                              // Stop
    }

    try {
      // Call login API
      const response = await axios.post(                                   // POST to /user/login with query
        `${BASE_URL}/user/login?universityName=${encodeURIComponent(uni)}`,// Encode university in URL
        { email, password }                                                // Body payload
      );

      // Destructure response
      const { message, token, user } = response.data;                      // Read message, JWT, user object

      // Persist common values to localStorage
      if (user?.universityId) {                                            // If backend returned universityId
        localStorage.setItem("universityId", user.universityId);           // Save for later use
      }

      localStorage.setItem("University authToken", token);                 // Save JWT (note the key has a space)
      localStorage.setItem("user", JSON.stringify(user));                  // Save entire user JSON
      localStorage.setItem("universityAuth", "true");                      // Flag that user is authenticated
      localStorage.setItem("universityName", uni);                         // Save university name (from input)

      // Keep a consistent universityId set (if not already set above)
      if (!localStorage.getItem("universityId") && user?.universityId) {   // Avoid redundant overwrite
        localStorage.setItem("universityId", user.universityId);           // Set again (fallback guard)
      }

      // Placement-specific persistence
      if (user.role === "PlacementAdmin" && user.placementname) {          // If Placement Admin
        localStorage.setItem("placementName", user.placementname);         // Persist placementName
      }

      if (user.role === "PlacementDirector" && user.name) {                // If Placement Director
        localStorage.setItem("placementDirectorName", user.name);          // Persist director display name
      }

      // Let other tabs/hooks know storage changed (optional but handy)
      window.dispatchEvent(new Event("storage"));                           // Fire 'storage' event manually

      // Quick user feedback
      alert(`${user.role} has ${message}`);                                 // Show role + message

      // Role-based navigation
      const { role } = user;                                                // Extract role
      const loginState = { state: { user, token, message } };               // Pass data via navigation state

      switch (role) {                                                       // Route by role
        case "UniversityAdmin":                                             // University admin dashboard
          navigate(`/dashboard/${uni}`, loginState);                        // /dashboard/:universityName
          break;

        case "PlacementDirector":                                           // Placement Director path
          // Note: original code referenced user.placementDirectorName (not in payload)
          // Using stored value or fallback to user.name for URL segment.
          navigate(
            `/dashboard/${uni}/placementDirector/${encodeURIComponent(user.name)}`,
>>>>>>> vbuzzUpdatedFrontend/main
            loginState
          );
          break;

<<<<<<< HEAD
        case "CollegeAdmin":
          navigate(
            `/dashboard/${universityName}/colleges/${user.collegeName}`,
=======
        case "PlacementAdmin":                                              // Placement Admin path
          navigate(
            `/dashboard/${uni}/placement/${encodeURIComponent(user.placementname)}`,
>>>>>>> vbuzzUpdatedFrontend/main
            loginState
          );
          break;

<<<<<<< HEAD
        case "DepartmentAdmin":
          navigate(
            `/dashboard/${universityName}/departments/${user.departmentName}`,
=======
        case "CollegeAdmin":                                                // College Admin path
          navigate(
            `/dashboard/${uni}/colleges/${encodeURIComponent(user.collegeName)}`,
>>>>>>> vbuzzUpdatedFrontend/main
            loginState
          );
          break;

<<<<<<< HEAD
        default:
          setError("Invalid role. Please contact the administrator.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="universityName"
              className="block text-sm font-medium text-gray-700"
            >
=======
        case "DepartmentAdmin":                                             // Department Admin path
          navigate(
            `/dashboard/${uni}/departments/${encodeURIComponent(user.departmentName)}`,
            loginState
          );
          break;

        default:                                                            // Unknown role fallback
          setError("Invalid role. Please contact the administrator.");      // Show error
      }
    } catch (err) {
      // Error handling
      const apiError = err?.response?.data?.error || "An error occurred";  // Prefer server error message
      setError(apiError);                                                  // Show error on UI
    }
  };

  // JSX render
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">  {/* Full screen center */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">        {/* Card container */}
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>           {/* Title */}

        {/* Error banner */}
        {error && (                                                              // If error present
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {error}                                                              {/* Show error */}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>                                            {/* Bind submit */}
          {/* University Name */}
          <div className="mb-4">
            <label htmlFor="universityName" className="block text-sm font-medium text-gray-700">
>>>>>>> vbuzzUpdatedFrontend/main
              University Name
            </label>
            <input
              id="universityName"
              type="text"
              value={universityName}
<<<<<<< HEAD
              onChange={(e) => setUniversityName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="university name (Andhra University)"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
=======
              onChange={(e) => setUniversityName(e.target.value)}               // Update universityName
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="university name (Andhra University)"                  // Placeholder example
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
>>>>>>> vbuzzUpdatedFrontend/main
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
<<<<<<< HEAD
              onChange={(e) => setEmail(e.target.value)}
=======
              onChange={(e) => setEmail(e.target.value)}                        // Update email
>>>>>>> vbuzzUpdatedFrontend/main
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
<<<<<<< HEAD
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
=======

          {/* Password + toggle */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
>>>>>>> vbuzzUpdatedFrontend/main
              Password
            </label>
            <input
              id="password"
<<<<<<< HEAD
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
=======
              type={showPassword ? "text" : "password"}                          // Toggle text/password
              value={password}
              onChange={(e) => setPassword(e.target.value)}                      // Update password
>>>>>>> vbuzzUpdatedFrontend/main
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button
              type="button"
<<<<<<< HEAD
              className="absolute top-8 my-auto inset-y-2 right-2 bottom-2 flex items-center p-2  focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
=======
              className="absolute top-8 my-auto inset-y-2 right-2 bottom-2 flex items-center p-2 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}                     // Flip toggle
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}                         {/* Icon */}
            </button>
          </div>

          {/* Submit button */}
>>>>>>> vbuzzUpdatedFrontend/main
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default UniversityLogin;


=======
// Export component
export default UniversityLogin;                                                // Default export
>>>>>>> vbuzzUpdatedFrontend/main
