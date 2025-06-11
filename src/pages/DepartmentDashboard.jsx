import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManageCourses from '../Dashboards/DepartmentDashboard/ManageCourse';
import DepartmentFaculty from '../Dashboards/DepartmentDashboard/DepartmentFaculty';
import DepartmentStudents from '../Dashboards/DepartmentDashboard/DepartmentStudent';
import DepartmentInfo from '../Dashboards/DepartmentDashboard/DepartmentInformation';
import DepartmentReports from '../Dashboards/DepartmentDashboard/DepartmentReports';
import { useParams, useLocation } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DepartmentDashboard() {
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const departmentName = user?.departmentName;

  const [activeComponent, setActiveComponent] = useState('DepartmentStudents');
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

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
    ManageCourses: (
      <ManageCourses
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentFaculty: (
      <DepartmentFaculty
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentStudents: (
      <DepartmentStudents
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentInfo: (
      <DepartmentInfo
        departmentId={user?.departmentId}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentReports: (
      <DepartmentReports
        departmentId={user?.departmentId}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
  };

  // Sidebar item definitions
  const sidebarItems = [
    { id: 'DepartmentStudents', label: 'Department Students' },
    { id: 'ManageCourses', label: 'Manage Courses' },
    { id: 'DepartmentFaculty', label: 'Faculty Management' },
    { id: 'DepartmentInfo', label: 'Department Information' },
    { id: 'DepartmentReports', label: 'Reports' },
  ];

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800 p-6">{departmentName} Department</h1>
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
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-700 mb-6">Department Management Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {components[activeComponent]}
          </div>
        </div>
      </div>
    </>
  );
}

export default DepartmentDashboard;
