import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { 
  Bell, 
  Briefcase, 
  User, 
  FileText, 
  BarChart3, 
  Target,
  GraduationCap,
  Settings,
  Menu,
  X
} from 'lucide-react';
import ProfileManagement from '../Dashboards/StudentDashboard/ProfileManagment';
import JobOpportunities from '../Dashboards/StudentDashboard/Job/JobOpportunities';
import JobRound from '../Dashboards/StudentDashboard/Job/JobRound';
import ManageNotice from '../Dashboards/StudentDashboard/Job/Notices';
import AdmissionStepperPage from '../Dashboards/StudentDashboard/Admission/components/AdmissionStepperPage.jsx';
import PlacementAnalysis from '../Dashboards/StudentDashboard/PlacementReports/PlacementAnalysis.jsx';
import ResumeBuilder from '../Dashboards/StudentDashboard/Resume/Resume/ResumeBuilder';
import axios from 'axios';

function StudentDashboard() {
  const location = useLocation();
  const [studentData, setStudentData] = useState(location.state || {});
  const [students, setStudents] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeComponent, setActiveComponent] = useState('ManageNotice');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("Student token");
  const universityName = useParams().universityName;

  const studentUser = JSON.parse(localStorage.getItem("Student User") || "{}"); 
  const studentId = studentUser?.id || studentData?.student?.id;

  // Save student data in localStorage
  useEffect(() => {
    if (studentData && !localStorage.getItem('studentData')) {
      localStorage.setItem('studentData', JSON.stringify(studentData));
      localStorage.setItem("department", studentData?.student?.department);
    }
  }, []);

  // Fetch student data
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
        setStudents(response?.data);
        
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

  // Components mapping
  const components = {
    PlacementAnalysis: <PlacementAnalysis studnets={students} />,
    JobOpportunities: <JobOpportunities studentData={studentData} />,
    JobRound: <JobRound studentData={studentData}/>,
    ManageNotice: <ManageNotice studentData={studentData} setUnreadCount={setUnreadCount} />,
    ProfileManagements: <ProfileManagement studentData={studentData}/>,
    AdmissionStepperPage: <AdmissionStepperPage studentData={studentData} />,
    ResumeBuilder: <ResumeBuilder />,
  };

  // Sidebar items with icons
  const sidebarItems = [
    { 
      id: 'ManageNotice', 
      label: 'Notices', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      description: 'View important announcements'
    },
    { 
      id: 'JobOpportunities', 
      label: 'Job Opportunities', 
      icon: Briefcase,
      description: 'Browse available positions'
    },
    {
      id: 'PlacementAnalysis', 
      label: 'Placement Reports', 
      icon: BarChart3,
      description: 'Track your placement progress'
    },
    { 
      id: 'JobRound', 
      label: 'Interview Rounds', 
      icon: Target,
      description: 'Monitor interview status'
    },
    { 
      id: 'ProfileManagements', 
      label: 'Profile Management', 
      icon: User,
      description: 'Update your information'
    },
    { 
      id: 'ResumeBuilder', 
      label: 'Resume Builder', 
      icon: FileText,
      description: 'Create professional resumes'
    },
    { 
      id: 'AdmissionStepperPage', 
      label: 'Admissions', 
      icon: GraduationCap,
      description: 'Manage applications'
    },
  ];

  const currentItem = sidebarItems.find(item => item.id === activeComponent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {studentData?.student?.name || 'Student'}
              </h1>
              <p className="text-sm text-gray-500">Student Dashboard</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {(studentData?.student?.name || 'S').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-xl border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {(studentData?.student?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {studentData?.student?.name || 'Student Name'}
                </h2>
                <p className="text-sm text-gray-500">Student Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveComponent(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                    activeComponent === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      activeComponent === item.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activeComponent === item.id 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        activeComponent === item.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-80 bg-white shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {(studentData?.student?.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {studentData?.student?.name || 'Student Name'}
                      </h2>
                      <p className="text-sm text-gray-500">Student Dashboard</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveComponent(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                        activeComponent === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${
                          activeComponent === item.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                activeComponent === item.id 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-red-500 text-white'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${
                            activeComponent === item.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          {/* Content Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              {currentItem && (
                <>
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <currentItem.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{currentItem.label}</h1>
                    <p className="text-sm text-gray-500">{currentItem.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {components[activeComponent]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;