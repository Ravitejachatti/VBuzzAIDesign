import React, { useState, useEffect } from "react";
import UniversityInfo from "../Dashboards/UniversityDashboards/UniversityInformation";
import AdmissionReports from "../Dashboards/UniversityDashboards/AdmissionReports";
import PlacementReports from "../Dashboards/UniversityDashboards/PlacementReport";
import { useParams, useLocation } from "react-router-dom";
import Settings from "../Dashboards/UniversityDashboards/Settings";
import Colleges from "../Dashboards/UniversityDashboards/AddEditCollege/Colleges";
import Departments from "../Dashboards/UniversityDashboards/ManageDepartments/Departments";
import Placements from "../Dashboards/UniversityDashboards/PlacementCell/Placement";
import Programs from "../Dashboards/UniversityDashboards/Programs/Program";
import axios from "axios";
import Admission from "../Dashboards/AdmissionDepartment/ components/ApplicationsTable";
import { useNavigate } from "react-router-dom";


function UniversityDashboard() {
  const { universityName } = useParams(); // Get dynamic university name
  const location = useLocation(); // Access user data from the state
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [departments, setDepartments] = useState([]);
    const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Extracting data from the login response
  const { user, message } = location.state || {};
  const token = localStorage.getItem("University authToken"); // Retrieve token from localStorage
  console.log("Token in University Dashboard:", token);



   // Fetch Colleges
useEffect(() => {
  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setColleges(response.data);
      console.log("Colleges fetched:", response.data);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    }
  };

  fetchColleges();
}, [universityName]); // Dependency array ensures it runs when `universityName` changes

// Fetch Departments  
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}//department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setDepartments(response.data); // Assuming API returns { success: true, data: [...] }
      console.log("Departments fetched in University Dashboard:", response.data);
    } catch (err) {
      setError("Failed to fetch departments.");
      console.error(err);
    }
  };


  useEffect(() => {
    fetchDepartments();
  }, [BASE_URL, universityName]);

// fetch Programs
useEffect(() => {
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/program/getprograms?universityName=${encodeURIComponent(
          universityName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrograms(response.data.data);
    } catch (err) {
      setError("Failed to fetch programs.");
      console.error(err);
    }
  };
    fetchPrograms();
  }, [universityName]);

  console.log("colleges fetched in univrsity dashboard:",colleges)
  console.log("Departments fetched in University Dashboard:",departments)
  console.log("Programs fetched  in university Dashborad:",programs)
  
  // State for the active component
  const [activeComponent, setActiveComponent] = useState("Colleges");

  // Log the login response data in the console
  useEffect(() => {
    if (user && message && token) {
      console.log("Login Response:");
      console.log("Message:", message);
      console.log("Token:", token);
      console.log("User Details:");
      console.log("ID:", user.id);
      console.log("Name:", user.name);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
      console.log("Institute Name:", user.instituteName);
    }
  }, [user, message, token]);

  // Mapping of components
 // Mapping of components with user prop
const components = {
  Colleges: <Colleges user={user}  colleges={colleges} departments={departments} programs={programs} />,
  Departments:<Departments colleges={colleges} user={user} programs={programs}/>,
  // Program:<AddProgram user={user} colleges={colleges} departments={departments} programs={programs}/>,
  // ViewPrograms:<ViewPrograms user={user}  departments={departments}/>,
  Programs: <Programs colleges={colleges} departments={departments} programs={programs}/>,
  Placements: <Placements user = {user}  universityName={universityName} colleges={colleges} departments={departments} programs={programs}  />,

  UniversityInfo: <UniversityInfo user={user} />,
  AdmissionReports: <AdmissionReports user={user} />,
  PlacementReports: <PlacementReports user={user} />,
  Settings: <Settings user={user} />,
  Admission: <Admission user={user} universityName={universityName} />,
};

  // Sidebar item definitions
  const sidebarItems = [
    { id: "Colleges", label: "Colleges" },
    { id: "Departments", label: "Departments" },
    {id: "Programs", label:"Programs"},
    { id: "Placements", label: "Placements" },
    { id: "UniversityInfo", label: "University Information" },
    { id: "AdmissionReports", label: "Admission Reports" },
    { id: "PlacementReports", label: "Placement Reports" },
    { id: "Settings", label: "Settings" },
    { id: "Admission", label: "Admission" },
  ];
  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <h1 className="text-lg font-semibold text-gray-800 pt-6 pl-6 pb-1">
          University Dashboard
        </h1>
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`w-full text-left py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 ${
                activeComponent === item.id ? "bg-gray-200" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="bg-white shadow-lg md:hidden w-full">
        <select
          onChange={(e) => setActiveComponent(e.target.value)}
          className="w-full p-3 bg-gray-100 text-gray-700"
        >
          {sidebarItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold text-gray-700 text-center">
          {universityName} Management Dashboard
        </h1>
        <div className="">
          {components[activeComponent]}
        </div>
      </div>
    </div>
  );
}

export default UniversityDashboard;
