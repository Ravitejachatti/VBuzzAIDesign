import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  Upload, 
  Briefcase, 
  List, 
  FileText, 
  Settings, 
  Bell, 
  BarChart3,
  Target,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

// Import components
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
  const { placementname } = useParams();

  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [universityId, setUniversityId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("University authToken");
  const placementName = localStorage.getItem("placementName");

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    placedStudents: 0,
    activeNotices: 0
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchColleges(),
          fetchDepartments(),
          fetchPrograms(),
          fetchStudents()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universityName]);

  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setColleges(response.data);
      if (response.data.length > 0) {
        setUniversityId(response.data[0].university);
      }
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrograms(response.data.data);
    } catch (err) {
      console.error("Failed to fetch programs:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/student/?universityName=${universityName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentData = res.data.students || [];
      setStudents(studentData);
      setFilteredStudents(studentData);
      
      const uniqueYears = [...new Set(studentData.map(s => s.graduation_year))];
      setGraduationYears(uniqueYears);

      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        totalStudents: studentData.length,
        placedStudents: studentData.filter(s => s.isPlaced).length
      }));
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const sidebarItems = [
    { 
      id: "Dashboard", 
      label: "Dashboard", 
      icon: BarChart3,
      category: "overview"
    },
    { 
      id: "AddStudentForm", 
      label: "Add Student", 
      icon: UserPlus,
      category: "students"
    },
    { 
      id: "BulkUploadForm", 
      label: "Bulk Upload", 
      icon: Upload,
      category: "students"
    },
    { 
      id: "StudentList", 
      label: "Students List", 
      icon: Users,
      category: "students"
    },
    { 
      id: "JobForm", 
      label: "Add Job", 
      icon: Briefcase,
      category: "jobs"
    },
    { 
      id: "JobList", 
      label: "Jobs List", 
      icon: List,
      category: "jobs"
    },
    { 
      id: "StudentsAppliedForJob", 
      label: "Job Applications", 
      icon: FileText,
      category: "jobs"
    },
    { 
      id: "AddRound", 
      label: "Manage Rounds", 
      icon: Target,
      category: "rounds"
    },
    { 
      id: "PlacementReports", 
      label: "Placement Reports", 
      icon: BarChart3,
      category: "reports"
    },
    { 
      id: "PlacementUpload", 
      label: "Upload Placement", 
      icon: Upload,
      category: "reports"
    },
    { 
      id: "Notice", 
      label: "Create Notice", 
      icon: Bell,
      category: "notices"
    },
    { 
      id: "ManageNotice", 
      label: "Manage Notices", 
      icon: Settings,
      category: "notices"
    },
    { 
      id: "Profile", 
      label: "Profile", 
      icon: Settings,
      category: "settings"
    }
  ];

  const categories = {
    overview: "Overview",
    students: "Student Management",
    jobs: "Job Management", 
    rounds: "Round Management",
    reports: "Reports & Analytics",
    notices: "Notices",
    settings: "Settings"
  };

  // Dashboard component
  const DashboardOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to {placementName}</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalJobs}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Placed Students</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.placedStudents}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Placement Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats.totalStudents > 0 
                  ? Math.round((dashboardStats.placedStudents / dashboardStats.totalStudents) * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveComponent("AddStudentForm")}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium text-blue-900">Add New Student</span>
          </button>
          <button
            onClick={() => setActiveComponent("JobForm")}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Briefcase className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Post New Job</span>
          </button>
          <button
            onClick={() => setActiveComponent("Notice")}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium text-purple-900">Create Notice</span>
          </button>
        </div>
      </div>
    </div>
  );

  const components = {
    Dashboard: <DashboardOverview />,
    AddStudentForm: <AddStudentForm   
      universityId={universityId}
      colleges={colleges}
      departments={departments}
      programs={programs}
      onStudentAdded={() => window.location.reload()} 
    />,
    BulkUploadForm: <BulkUploadForm 
      universityId={universityId}
      colleges={colleges}
      departments={departments}
      programs={programs}
      onUploadSuccess={() => window.location.reload()} 
    />,
    StudentList: <StudentList 
      colleges={colleges} 
      departments={departments}  
      programs={programs} 
    />,
    JobForm: <JobForm 
      user={user}  
      colleges={colleges}
      departments={departments}
      programs={programs} 
      onJobAdded={() => window.location.reload()} 
    />,
    JobList: <JobManager 
      colleges={colleges} 
      departments={departments} 
      programs={programs}
    />,
    RoundsManager: <RoundsManager 
      user={user} 
      universityName={universityName} 
      colleges={colleges} 
      departments={departments} 
    />,
    UploadApplicants: <UploadApplicants 
      user={user} 
      universityName={universityName} 
      colleges={colleges} 
      departments={departments} 
    />,  
    PlacementUpload: <PlacementUpload 
      universityName={universityName} 
      colleges={colleges} 
      departments={departments} 
      programs={programs}
    />,
    PlacementReports: <PlacementReports  
      colleges={colleges}
      departments={departments}
      programs={programs}
      students={students}
    />,
    StudentsAppliedForJob: <StudentsAppliedForJob 
      user={user} 
      universityName={universityName}  
      departments={departments}  
      programs={programs} 
      colleges={colleges}   
      students={students}
    />,
    ToggleEligibility: <ToggleEligibility 
      colleges={colleges} 
      departments={departments} 
      programs={programs}
    />,
    AddRound: <AddRound   
      colleges={colleges} 
      departments={departments} 
    />,
    Notice: <Notices  
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
      students={students}
    />,
    ManageNotice: <ManageNotice  
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
      students={students}
    />,
    Profile: <Profile 
      user={user} 
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
    />
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{placementName}</h2>
              <p className="text-sm text-gray-600">{universityName}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryLabel]) => {
              const categoryItems = sidebarItems.filter(item => item.category === categoryKey);
              
              return (
                <div key={categoryKey}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {categoryLabel}
                  </h3>
                  <div className="space-y-1">
                    {categoryItems.map((item) => {
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
                            w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                            ${isActive 
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                          {item.label}
                          {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeComponent)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {categories[sidebarItems.find(item => item.id === activeComponent)?.category]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.name || 'Admin'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {components[activeComponent]}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PlacementDashboard;