
import axios from 'axios';
import AddDepartments from '../Dashboards/CollegeDashboard/AddDepartments';
import ManageFaculty from '../Dashboards/CollegeDashboard/ManageFaculty';
import ViewStudents from '../Dashboards/CollegeDashboard/ViewStudents';
import CollegeInfo from '../Dashboards/CollegeDashboard/CollegeInformation';
import Reports from '../Dashboards/CollegeDashboard/PlacementReports';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import JobOpenings from '../Dashboards/CollegeDashboard/JobOpenings';
import Notices from '../Dashboards/CollegeDashboard/Notices';
import Settings from '../Dashboards/CollegeDashboard/Settings';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CollegeDashboard() {
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const CollegeName = user?.collegeName;

  const [activeComponent, setActiveComponent] = useState('ViewStudents');
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  console.log('User is here, here is user:', user);

  // Fetch Colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setColleges(response.data);
        console.log('Colleges fetched:', response.data);
      } catch (err) {
        console.error('Failed to fetch colleges:', err);
      }
    };

    fetchColleges();
  }, [universityName, token]);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartments(response.data);
        console.log('Departments fetched:', response.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    fetchDepartments();
  }, [universityName, token]);

  // Fetch Programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/program/getprograms?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrograms(response.data.data);
        console.log('Programs fetched:', response.data.data);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      }
    };

    fetchPrograms();
  }, [universityName, token]);

  // Mapping of components
  const components = {
    AddDepartments: (
      <AddDepartments
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    ManageFaculty: (
      <ManageFaculty
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    ViewStudents: (
      <ViewStudents
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName ={CollegeName}
        user={user}
      
      />
    ),
    CollegeInfo: (
      <CollegeInfo
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    Reports: (
      <Reports
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />),
    
    JobOpenings: (
      <JobOpenings
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />),
    Notices: (
      <Notices
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />),
    Settings: (
      <Settings
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />
    ),
  };

  // Sidebar item definitions
  const sidebarItems = [ 
     { id: 'ViewStudents', label: 'View Students' },
      { id: 'Reports', label: 'Placement Reports' },
    { id: 'AddDepartments', label: 'Departments' },
    { id: 'ManageFaculty', label: 'Manage Faculty' },
    { id: 'CollegeInfo', label: 'College Information' },
    { id: 'JobOpenings', label: 'Job Openings' },
    { id: 'Notices', label: 'Notices' },
    { id: 'Settings', label: 'Settings' },
  
  ];

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <h1 className="text-lg font-semibold text-gray-800 p-6 ">{CollegeName} Dashboard</h1>
          <nav className="space-y-2 px-6">
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
        <div className="flex-1 p-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {components[activeComponent]}
          </div>
        </div>
      </div>
    </>
  );
}

export default CollegeDashboard;
