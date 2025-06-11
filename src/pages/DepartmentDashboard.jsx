import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Settings, 
  Info,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';

// Import components
import DashboardOverview from '../Dashboards/DepartmentDashboard/DashboardOverview';
import DepartmentStudents from '../Dashboards/DepartmentDashboard/DepartmentStudent';
import DepartmentFaculty from '../Dashboards/DepartmentDashboard/DepartmentFaculty';
import DepartmentReports from '../Dashboards/DepartmentDashboard/DepartmentReports';
import ProgramsCourses from '../Dashboards/DepartmentDashboard/ProgramsCourses';
import DepartmentInfo from '../Dashboards/DepartmentDashboard/DepartmentInformation';
import DepartmentJobs from '../Dashboards/DepartmentDashboard/DepartmentJobs';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DepartmentDashboard() {
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const departmentName = user?.departmentName;

  const [activeComponent, setActiveComponent] = useState('DashboardOverview');
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Colleges
        const collegesResponse = await axios.get(
          `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setColleges(collegesResponse.data);

        // Fetch Departments
        const departmentsResponse = await axios.get(
          `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDepartments(departmentsResponse.data);

        // Fetch Programs
        const programsResponse = await axios.get(
          `${BASE_URL}/program/getprograms?universityName=${encodeURIComponent(universityName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrograms(programsResponse.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    if (universityName && token) {
      fetchData();
    }
  }, [universityName, token]);

  // Sidebar navigation items
  const sidebarItems = [
    { 
      id: 'DashboardOverview', 
      label: 'Dashboard Overview', 
      icon: LayoutDashboard,
      description: 'Main dashboard with key metrics'
    },
    { 
      id: 'DepartmentStudents', 
      label: 'Students', 
      icon: GraduationCap,
      description: 'Manage department students'
    },
    { 
      id: 'DepartmentFaculty', 
      label: 'Faculty', 
      icon: Users,
      description: 'Faculty management and profiles'
    },
    { 
      id: 'ProgramsCourses', 
      label: 'Programs & Courses', 
      icon: BookOpen,
      description: 'Academic programs and courses'
    },
    { 
      id: 'DepartmentJobs', 
      label: 'Job Opportunities', 
      icon: Briefcase,
      description: 'Department job postings'
    },
    { 
      id: 'DepartmentReports', 
      label: 'Reports & Analytics', 
      icon: FileText,
      description: 'Performance reports and analytics'
    },
    { 
      id: 'DepartmentInfo', 
      label: 'Department Information', 
      icon: Info,
      description: 'Department details and settings'
    }
  ];

  // Component mapping
  const components = {
    DashboardOverview: (
      <DashboardOverview
        departmentId={user?.departmentId}
        departmentName={departmentName}
        token={token}
        universityName={universityName}
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
    DepartmentFaculty: (
      <DepartmentFaculty
        departmentId={user?.departmentId}
        departmentName={departmentName}
        token={token}
        universityName={universityName}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    ProgramsCourses: (
      <ProgramsCourses
        departmentId={user?.departmentId}
        departmentName={departmentName}
        token={token}
        universityName={universityName}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentJobs: (
      <DepartmentJobs
        departmentId={user?.departmentId}
        departmentName={departmentName}
        token={token}
        universityName={universityName}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentReports: (
      <DepartmentReports
        departmentId={user?.departmentId}
        departmentName={departmentName}
        token={token}
        universityName={universityName}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentInfo: (
      <DepartmentInfo
        departmentId={user?.departmentId}
        departmentName={departmentName}
        token={token}
        universityName={universityName}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    )
  };

  const currentItem = sidebarItems.find(item => item.id === activeComponent);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{departmentName}</h1>
              <p className="text-sm text-gray-600">Department Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:shadow-sm border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{departmentName}</h1>
                  <p className="text-sm text-gray-600">Department Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeComponent === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveComponent(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">Department Management System</p>
              <p className="text-xs text-gray-400 mt-1">v2.0.0</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentItem?.label}
                </h2>
                <p className="text-gray-600 mt-1">
                  {currentItem?.description}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'D'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {components[activeComponent]}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default DepartmentDashboard;