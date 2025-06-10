import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import ProfileManagement from '../Dashboards/StudentDashboard/ProfileManagment';
import JobOpportunities from '../Dashboards/StudentDashboard/Job/JobOpportunities';
import JobRound from '../Dashboards/StudentDashboard/Job/JobRound';
import ManageNotice from '../Dashboards/StudentDashboard/Job/Notices';
import ProfileManagements from '../Dashboards/StudentDashboard/ProfileManagment';
import AdmissionStepperPage from '../Dashboards/StudentDashboard/Admission/components/AdmissionStepperPage.jsx';
import PlacementAnalysis from '../Dashboards/StudentDashboard/PlacementReports/PlacementAnalysis.jsx';
import { use } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function StudentDashboard() {
  const location = useLocation();
  const [studentData, setStudentData] = useState(location.state || {});
  const [studnets, setStudents] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);


 const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("Student token"); // Retrieve token from localStorage
  const universityName = useParams().universityName;

  // Get student ID from either props or localStorage
const studentUser = JSON.parse(localStorage.getItem("Student User") || "{}"); 
const studentId =studentUser?.id  || studentData?.student?.id;




  console.log("Student ID in student dashborad:", studentId);
  console.log("Student Data:", studentData);

  localStorage.getItem("Student User");
  console.log("Student Data in this page:", studentData);
  
    // Save student data in localStorage (if not already stored)
    useEffect(() => {
      if (studentData && !localStorage.getItem('studentData')) {
        localStorage.setItem('studentData', JSON.stringify(studentData));
        localStorage.setItem("department", studentData?.student?.department);
      }
    }, []);



    useEffect(() => {
      if (!studentId) {
        console.error("No studentId found.");
        return;
      }
  
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
         
          const { student } = response?.data;
          console.log("Student data fetched for resume in student dashboardssss:", student);
          setStudents(response?.data)
          if (!student) {
            throw new Error("Student data is missing in the response.");
          }
          localStorage.setItem("studentData", JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };
   
  
      fetchStudentData();
    }, [BASE_URL, studentId, universityName, token]);


    useEffect(() => {
      console.log("Students updated are:", studnets);
    }, [studnets]);
    

  // State for active component
  const [activeComponent, setActiveComponent] = useState('ManageNotice');

  // Sidebar items and corresponding components
  const components = {
    PlacementAnalysis: <PlacementAnalysis studnets={studnets} />,
    JobOpportunities: <JobOpportunities studentData={studentData} />,
    JobRound: <JobRound studentData={studentData}/> ,
    ManageNotice: <ManageNotice studentData={studentData} setUnreadCount={setUnreadCount} /> ,
    ProfileManagements : <ProfileManagements studentData={studentData}/>,
    AdmissionStepperPage: <AdmissionStepperPage studentData={studentData} />,
  };

  // Sidebar item titles
  const sidebarItems = [ 
    { id: 'ManageNotice', label: `Notice ${unreadCount > 0 ? `(${unreadCount})` : ""}` },
     { id: 'JobOpportunities', label: 'Jobs' },
    {id: 'PlacementAnalysis', label: 'Reports'},
  
    { id: 'JobRound', label: 'Round' },
  
    { id: 'ProfileManagements', label: 'Profile' },
    { id: 'AdmissionStepperPage', label: 'Admission' },
    { id: 'AdmissionStepper', label: 'c.verification' },
 

  ];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-64 bg-white shadow-lg">
        <h1 className="text-xl font-semibold text-gray-800 p-5">Dashboard Menu</h1>
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`w-full text-left py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 ${
                activeComponent === item.id ? 'bg-gray-200' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar for smaller screens */}
      <div className="block md:hidden w-full bg-white shadow-lg">
        <div className="overflow-x-auto flex p-4 space-x-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`whitespace-nowrap py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 ${
                activeComponent === item.id ? 'bg-gray-200' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3">
        <h1 className="text-xl font-semibold text-gray-700 mb-2 text-center">Welcome {studentData?.student?.name}</h1>
        <div className="bg-white py-1">
          {components[activeComponent]}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

