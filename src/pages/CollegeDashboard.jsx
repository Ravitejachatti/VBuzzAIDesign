import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Building, 
  BookOpen, 
  TrendingUp, 
  Bell, 
  Settings, 
  FileText, 
  Briefcase,
  UserPlus,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Award,
  Calendar,
  MapPin
} from 'lucide-react';

// Import all dashboard components
import AddDepartments from '../Dashboards/CollegeDashboard/AddDepartments';
import ManageFaculty from '../Dashboards/CollegeDashboard/ManageFaculty';
import ViewStudents from '../Dashboards/CollegeDashboard/ViewStudents';
import CollegeInfo from '../Dashboards/CollegeDashboard/CollegeInformation';
import Reports from '../Dashboards/CollegeDashboard/PlacementReports';
import JobOpenings from '../Dashboards/CollegeDashboard/JobOpenings';
import Notices from '../Dashboards/CollegeDashboard/Notices';
import SettingsPage from '../Dashboards/CollegeDashboard/Settings';
import DashboardOverview from '../Dashboards/CollegeDashboard/DashboardOverview';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CollegeDashboard() {
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const CollegeName = user?.collegeName;

  const [activeComponent, setActiveComponent] = useState('DashboardOverview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebar navigation items with enhanced metadata
  const sidebarItems = [
    { 
      id: 'DashboardOverview', 
      label: 'Dashboard Overview', 
      icon: BarChart3, 
      description: 'Main dashboard with analytics',
      category: 'Overview'
    },
    { 
      id: 'ViewStudents', 
      label: 'Student Management', 
      icon: Users, 
      description: 'View and manage students',
      category: 'Management'
    },
    { 
      id: 'Reports', 
      label: 'Placement Reports', 
      icon: TrendingUp, 
      description: 'Placement analytics and reports',
      category: 'Analytics'
    },
    { 
      id: 'AddDepartments', 
      label: 'Department Management', 
      icon: Building, 
      description: 'Add and manage departments',
      category: 'Management'
    },
    { 
      id: 'ManageFaculty', 
      label: 'Faculty Management', 
      icon: GraduationCap, 
      description: 'Manage faculty members',
      category: 'Management'
    },
    { 
      id: 'JobOpenings', 
      label: 'Job Opportunities', 
      icon: Briefcase, 
      description: 'Manage job openings',
      category: 'Opportunities'
    },
    { 
      id: 'Notices', 
      label: 'Notice Board', 
      icon: Bell, 
      description: 'College announcements',
      category: 'Communication'
    },
    { 
      id: 'CollegeInfo', 
      label: 'College Information', 
      icon: FileText, 
      description: 'College details and info',
      category: 'Information'
    },
    { 
      id: 'Settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'System preferences',
      category: 'System'
    },
  ];

  // Group sidebar items by category
  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Fetch data functions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchColleges(),
          fetchDepartments(),
          fetchPrograms()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universityName, token]);

  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setColleges(response.data);
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/program/getprograms?universityName=${encodeURIComponent(universityName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrograms(response.data.data);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    }
  };

  // Component mapping
  const components = {
    DashboardOverview: (
      <DashboardOverview
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        user={user}
      />
    ),
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
        CollegeName={CollegeName}
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
      />
    ),
    JobOpenings: (
      <JobOpenings
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />
    ),
    Notices: (
      <Notices
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />
    ),
    Settings: (
      <SettingsPage
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />
    ),
  };

  const currentItem = sidebarItems.find(item => item.id === activeComponent);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading College Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{CollegeName}</h1>
              <p className="text-sm text-gray-500">College Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl border-r border-gray-200
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out
        `}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{CollegeName}</h1>
                <p className="text-blue-100 text-sm">College Dashboard</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-sm text-gray-500">{user?.role || 'College Admin'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeComponent === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveComponent(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                          transition-all duration-200 group
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${isActive ? 'text-white' : ''}`}>
                            {item.label}
                          </p>
                          <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © 2024 V-Buzz College Management
              </p>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {currentItem && <currentItem.icon className="w-6 h-6 text-blue-600" />}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentItem?.label || 'Dashboard'}
                  </h2>
                </div>
                <p className="text-gray-600 mt-1">
                  {currentItem?.description || 'Manage your college operations'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{universityName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
              {components[activeComponent]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDashboard;