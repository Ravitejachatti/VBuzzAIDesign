import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaBuilding, 
  FaGraduationCap, 
  FaBriefcase, 
  FaBook, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaUniversity,
  FaClipboardList,
  FaFileAlt,
  FaBell,
  FaSearch
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// Import components
import UniversityInfo from "../Dashboards/UniversityDashboards/UniversityInformation";
import AdmissionReports from "../Dashboards/UniversityDashboards/AdmissionReports";
import PlacementReports from "../Dashboards/UniversityDashboards/PlacementReport/PlacementReport";
import Settings from "../Dashboards/UniversityDashboards/Settings";
import Colleges from "../Dashboards/UniversityDashboards/AddEditCollege/Colleges";
import Departments from "../Dashboards/UniversityDashboards/ManageDepartments/Departments";
import Placements from "../Dashboards/UniversityDashboards/PlacementCell/Placement";
import Programs from "../Dashboards/UniversityDashboards/Programs/Program";
import Admission from "../Dashboards/AdmissionDepartment/ components/ApplicationsTable";

function UniversityDashboard() {
  const { universityName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State management
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // User data from login
  const { user, message } = location.state || {};
  const token = localStorage.getItem("University authToken");

  // Sidebar navigation items
  const navigationItems = [
    {
      id: "Dashboard",
      label: "Dashboard Overview",
      icon: FaHome,
      description: "Main dashboard with key metrics",
      category: "main"
    },
    {
      id: "Colleges",
      label: "Colleges",
      icon: FaBuilding,
      description: "Manage college information",
      category: "academic"
    },
    {
      id: "Departments",
      label: "Departments",
      icon: FaGraduationCap,
      description: "Department management",
      category: "academic"
    },
    {
      id: "Programs",
      label: "Programs",
      icon: FaBook,
      description: "Academic programs",
      category: "academic"
    },
    {
      id: "Placements",
      label: "Placement Cells",
      icon: FaBriefcase,
      description: "Placement management",
      category: "placement"
    },
    {
      id: "PlacementReports",
      label: "Placement Reports",
      icon: FaChartBar,
      description: "Analytics and reports",
      category: "placement"
    },
    {
      id: "Admission",
      label: "Admissions",
      icon: FaUserGraduate,
      description: "Admission management",
      category: "admin"
    },
    {
      id: "AdmissionReports",
      label: "Admission Reports",
      icon: FaFileAlt,
      description: "Admission analytics",
      category: "admin"
    },
    {
      id: "UniversityInfo",
      label: "University Info",
      icon: FaUniversity,
      description: "University details",
      category: "admin"
    },
    {
      id: "Settings",
      label: "Settings",
      icon: FaCog,
      description: "System settings",
      category: "admin"
    }
  ];

  // Fetch data on component mount
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
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [universityName, token]);

  // Fetch functions
  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setColleges(response.data);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
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
      console.error("Failed to fetch departments:", err);
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
      console.error("Failed to fetch programs:", err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("universityAuth");
    localStorage.removeItem("University authToken");
    localStorage.removeItem("universityName");
    localStorage.removeItem("user");
    localStorage.removeItem("placementName");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Component mapping
  const components = {
    Dashboard: <DashboardOverview 
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
      user={user}
      universityName={universityName}
    />,
    Colleges: <Colleges user={user} colleges={colleges} departments={departments} programs={programs} />,
    Departments: <Departments colleges={colleges} user={user} programs={programs} />,
    Programs: <Programs colleges={colleges} departments={departments} programs={programs} />,
    Placements: <Placements user={user} universityName={universityName} colleges={colleges} departments={departments} programs={programs} />,
    PlacementReports: <PlacementReports colleges={colleges} departments={departments} programs={programs} />,
    Admission: <Admission user={user} universityName={universityName} />,
    AdmissionReports: <AdmissionReports user={user} />,
    UniversityInfo: <UniversityInfo user={user} />,
    Settings: <Settings user={user} />
  };

  // Group navigation items by category
  const groupedNavigation = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryLabels = {
    main: "Main",
    academic: "Academic Management",
    placement: "Placement Management", 
    admin: "Administration"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <FaUniversity className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">University Portal</h1>
                <p className="text-blue-100 text-sm truncate">{universityName}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'University Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role || 'Administrator'}</p>
                <p className="text-xs text-blue-600 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-6">
              {Object.entries(groupedNavigation).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {categoryLabels[category]}
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
                          className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`mr-3 text-lg ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          <div className="text-left flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                              {item.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FaBars />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.id === activeComponent)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {navigationItems.find(item => item.id === activeComponent)?.description || 'University management system'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <FaBell />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {components[activeComponent]}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Dashboard Overview Component
const DashboardOverview = ({ colleges, departments, programs, user, universityName }) => {
  const stats = [
    {
      title: "Total Colleges",
      value: colleges?.length || 0,
      icon: FaBuilding,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Departments",
      value: departments?.length || 0,
      icon: FaGraduationCap,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Programs",
      value: programs?.length || 0,
      icon: FaBook,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: FaUsers,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  const recentActivities = [
    { action: "New college added", time: "2 hours ago", type: "success" },
    { action: "Department updated", time: "4 hours ago", type: "info" },
    { action: "Program created", time: "1 day ago", type: "success" },
    { action: "User registered", time: "2 days ago", type: "info" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Administrator'}!</h1>
            <p className="text-blue-100 text-lg">
              Managing {universityName} • {user?.role || 'University Administrator'}
            </p>
            <p className="text-blue-200 mt-2">
              Here's what's happening with your university today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaUniversity className="text-6xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`text-2xl ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaBuilding className="text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Add New College</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaGraduationCap className="text-green-600" />
              <span className="text-sm font-medium text-gray-900">Create Department</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaBook className="text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Add Program</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaChartBar className="text-orange-600" />
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
            <p className="text-xs text-gray-500">Last checked: 2 minutes ago</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">1,234 Active Users</p>
            <p className="text-xs text-gray-500">+12% from last week</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaChartBar className="text-2xl text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">98.9% Uptime</p>
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;