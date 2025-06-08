import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import AddStudentForm from "../Dashboards/PlacementDashboard/Student/StudentForm";
import BulkUploadForm from "../Dashboards/PlacementDashboard/Student/BulkUpload";
import StudentList from "../Dashboards/PlacementDashboard/Student/StudentList";
import JobForm from "../Dashboards/PlacementDashboard/job/JobForm";
import JobManager from "../Dashboards/PlacementDashboard/job/JobManager";
import RoundsManager from "../Dashboards/PlacementDashboard/RoundManage/RoundManager";
import UploadApplicants from "../Dashboards/PlacementDashboard/RoundManage/UploadApplicants";
import StudentsAppliedForJob from "../Dashboards/PlacementDashboard/job/StudentsAppliedForJob";
import ToggleEligibility from "../Dashboards/PlacementDashboard/Student/ToggleEligibility";
import AddRound from "../Dashboards/PlacementDashboard/RoundManage/AddRounds";
import Notices from "../Dashboards/PlacementDashboard/Notice/Notice";
import ManageNotice from "../Dashboards/PlacementDashboard/Notice/ManageNotice";
import Profile from "../Dashboards/PlacementDashboard/PlacementProfile/Profile";
import PlacementUpload from "../Dashboards/PlacementDashboard/PlacementReport/UploadPlacementData";
import PlacementReports from "../Dashboards/PlacementDashboard/PlacementReport/PlacementReport";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlacementDashboard() {
  const location = useLocation();
  const { user } = location.state || {};
  const { universityName } = useParams();
  const {placementname} = useParams();




  // console.log("placementname:",placementname)
  // console.log("uer in placement dashboard:",user)
  console.log("user", user)
  // console.log("universityName:", universityName)

  const [activeComponent, setActiveComponent] = useState("AddStudentForm");
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [universityId, setUniversityId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
const [filteredStudents, setFilteredStudents] = useState([]);

  const token = localStorage.getItem("University authToken");  
  console.log("token in placement dashboard:",token)
  const placementName =localStorage.getItem("placementName");


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

   console.log("Colleges fetched in placement dashboard:", response.data);
      if (response.data.length > 0) {
        setUniversityId(response.data[0].university);
        console.log("University ID:", response.data[0].university);
      }
     
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    }
  };

  fetchColleges();
}, [universityName]);

// Fetch Departments
useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setDepartments(response.data);
      console.log("Departments fetched in student form:", response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  fetchDepartments();
}, [universityName]);


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
      console.log("Programs fetched:", response.data.data);
    } catch (err) {
      setError("Failed to fetch programs.");
      console.error(err);
    }
  };
    fetchPrograms();
  }, [universityName]);

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/student/?universityName=${universityName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const studentData = res.data.students || [];
        setStudents(studentData);
        setFilteredStudents(studentData);
  
        // Optional: Extract graduation years
        const uniqueYears = [...new Set(studentData.map(s => s.graduation_year))];
        setGraduationYears(uniqueYears);
  
        console.log("Fetched students in placement dashboard:", studentData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
  
    fetchStudents();
  }, [universityName]);
  

  console.log("colleges:",colleges)
  console.log("programs",programs)
  console.log("departments:",departments)
  console.log("students:",students)



  const components = {
    AddStudentForm: <AddStudentForm   
    universityId={universityId}
    colleges={colleges}
    departments={departments}
    programs={programs}
    onStudentAdded={() => window.location.reload()} />,
    BulkUploadForm: <BulkUploadForm 
    universityId={universityId}
    colleges={colleges}
    departments={departments}
    programs={programs}
    onUploadSuccess={() => window.location.reload()} />,
    StudentList: <StudentList colleges={colleges} departments={departments}  programs={programs} />,
    JobForm: <JobForm user={user}  colleges={colleges}
    departments={departments}
    programs={programs} onJobAdded={() => window.location.reload()} />,
    JobList: <JobManager colleges={colleges} departments={departments} programs={programs}/>,
    RoundsManager: <RoundsManager user={user} universityName={universityName} colleges={colleges} departments={departments} />,
    UploadApplicants: <UploadApplicants user={user} universityName={universityName} colleges={colleges} departments={departments} />,  
    PlacementUpload: <PlacementUpload universityName={universityName} colleges={colleges} departments={departments} programs={programs}/>,
    PlacementReports: <PlacementReports  colleges={colleges}
    departments={departments}
    programs={programs}
    students={students}
    />,
    StudentsAppliedForJob: <StudentsAppliedForJob user={user} universityName={universityName}  departments={departments}  programs={programs} colleges={colleges}   students={students}/>,
    ToggleEligibility:<ToggleEligibility colleges={colleges} departments={departments} programs={programs}/>,
    AddRound: <AddRound   colleges={colleges} departments={departments} />,
    Notice: <Notices  colleges={colleges} departments={departments} programs={programs} students={students}/>,
    ManageNotice: <ManageNotice  colleges={colleges} departments={departments} programs={programs} students={students}/>,
    Profile:<Profile user={user} colleges={colleges} departments={departments} programs={programs} />
  };

  const sidebarItems = [
    { id: "AddStudentForm", label: "Add Student " },
    { id: "BulkUploadForm", label: "Bulk Upload " },
    { id: "StudentList", label: "Students List" },
    { id: "JobForm", label: "Add Job " },
    { id: "JobList", label: "Jobs List" },
    { id: "StudentsAppliedForJob", label: "Students Applied" },
    { id: "AddRound", label: " Add Round" },
    { id: "PlacementReports", label: "Placement Reports" },
    { id: "PlacementUpload", label: "Upload Placement" },
    { id: "Notice", label: "Notice" },
    { id: "ManageNotice", label: "Manage Notice" },
    { id: "Profile", label: "Profile" }
  ];

  return (
    <div className="bg-gray-100 flex flex-col lg:flex-row h-screen">

      {/* Sidebar */}
      <div
        className={`${
          activeComponent ? "lg:w-52" : "lg:w-0"
        } bg-white shadow-lg lg:flex flex-shrink-0  lg:static lg:h-full lg:overflow-y-auto lg:pb-0 pb-1 overflow-x-auto lg:flex-col flex-row`}
      >
        
        <nav className="lg:space-y-3 lg:px-6 px-1 flex lg:block text-center py-5">
        <h2 className="hidden md:block text-[16px] font-semibold text-center text-gray-700 underline">{placementName}
</h2>

          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`text-left py-2 px-4 rounded-lg lg:my-2 text-sm font-small hover:bg-gray-100 ${
                activeComponent === item.id ? "bg-gray-200 font-bold" : "text-gray-600"
              }`}
              aria-label={item.label}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
  

      {/* Main Content */}
      <div className="flex-1  overflow-y-auto">
        <div className="p-1 md:p-2 mx-2 ml-1 md:ml-3">
          <div className=" p-1">{components[activeComponent]}</div>
        </div>
      </div>
    </div>
  );
}

export default PlacementDashboard;



