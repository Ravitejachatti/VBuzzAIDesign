import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Home,
  Users,
  BookOpen,
  Briefcase,
  Bell,
  Settings,
  GraduationCap,
  Building2,
  UserCheck,
  FileText,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Award,
  Calendar,
  Shield,
  CheckCircle,
} from 'lucide-react';

import DepartmentInfo from '../Dashboards/DepartmentDashboard/DepartmentInformation';
import ViewStudents from '../Dashboards/DepartmentDashboard/ViewStudents';
import PlacementReports from "../Dashboards/DepartmentDashboard/placement/Reports";
import DepartProgram from '../Dashboards/DepartmentDashboard/Programs/DepartProgram';
import DepartFaculty from '../Dashboards/DepartmentDashboard/Faculty/DepartFaculty';
import DepartNotice from '../Dashboards/DepartmentDashboard/Notice/DepartNotice';

import { fetchColleges } from '../Redux/UniversitySlice';
import { fetchDept } from '../Redux/DepartmentSlice';
import { fetchProgram } from '../Redux/programs';
import { fetchStudents } from '../Redux/Placement/StudentsSlice';
import LoadingSpinner from '../components/Resuable/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DepartmentDashboard() {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const departmentName = user?.departmentName;

  const [students, setStudents] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [load, setLoad] = useState(false);
  const [activeComponent, setActiveComponent] = useState('ViewStudents');

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  // NEW: UI state to mirror CollegeDashboard
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== Data fetchers (unchanged logic, styled wrapper) =====
  const fetchCollegesData = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchColleges({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Colleges fetched successfully."); setColleges(result.payload);
      } else setError("Something went wrong.");
    } catch (err) {
      setError("Failed to fetch colleges.");
    }
    setLoad(false);
  };

  const fetchDepartments = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchDept({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Departments fetched successfully."); setDepartments(result.payload);
      } else setError("Something went wrong.");
    } catch (err) {
      setError("Failed to fetch departments.");
    }
    setLoad(false);
  };

  const fetchPrograms = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchProgram({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Programs fetched successfully."); setPrograms(result.payload);
      } else setError("Something went wrong.");
    } catch (err) {
      setError("Failed to fetch programs.");
    }
    setLoad(false);
  };

  const handleFetchStudents = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchStudents({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Students fetched successfully."); setStudents(result.payload);
      } else setError("Something went wrong.");
    } catch (err) {
      setError("Failed to fetch students.");
    }
    setLoad(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsFetchingAll(true);
      await Promise.all([
        fetchCollegesData(),
        fetchDepartments(),
        fetchPrograms(),
        handleFetchStudents()
      ]);
      setIsFetchingAll(false);
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityName]);

  // ===== Navigation config (styled like CollegeDashboard) =====
  const navigationItems = [
    {
      category: "Department",
      items: [
        { id: 'ViewStudents', label: 'Students', icon: Users, description: 'Student records & details', count: students.length },
        { id: 'PlacementReports', label: 'Placements', icon: BarChart3, description: 'Placement analytics' },
      ]
    },
    {
      category: "Academics",
      items: [
        { id: 'DepartProgram', label: 'Programs', icon: BookOpen, description: 'Academic programs', count: programs.length },
        { id: 'DepartFaculty', label: 'Faculty', icon: GraduationCap, description: 'Department faculty' },
      ]
    },
    {
      category: "Communication",
      items: [
        { id: 'DepartNotice', label: 'Notices', icon: Bell, description: 'Announcements & notices', badge: 'New' },
      ]
    },
    {
      category: "Settings",
      items: [
        { id: 'DepartmentInfo', label: 'Information', icon: FileText, description: 'Department information', completed: true },
        { id: 'Settings', label: 'Settings', icon: Settings, description: 'System settings' },
      ]
    }
  ];

  const components = {
    ViewStudents: (
      <ViewStudents
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    PlacementReports: (
      <PlacementReports
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartProgram: (
      <DepartProgram
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartFaculty: (
      <DepartFaculty
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartNotice: (
      <DepartNotice
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
    // Optional placeholder if someone clicks "Settings"
    Settings: (
      <div className="text-sm text-gray-600">Settings coming soon…</div>
    )
  };

  const handleNavigation = (id) => {
    setActiveComponent(id);
    setSidebarOpen(false);
  };

  const getCurrentPageInfo = () => {
    for (const cat of navigationItems) {
      const item = cat.items.find(i => i.id === activeComponent);
      if (item) return item;
    }
    return { label: 'Department', description: 'Department management' };
  };
  const currentPage = getCurrentPageInfo();

  if (isFetchingAll) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header (gradient) */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 opacity-5"></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{departmentName || 'Department'}</h1>
                <p className="text-blue-100 text-sm flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Management Portal
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-6">
          {navigationItems.map((category) => (
            <div key={category.category}>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mr-2"></div>
                {category.category}
              </h3>
              <div className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeComponent === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full"></div>}
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                      <div className="flex-1">
                        <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-blue-700'}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-600'}`}>
                          {item.description}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.count != null && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.completed && (
                          <CheckCircle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-500'}`} />
                        )}
                        {isActive && <ChevronRight className="w-4 h-4 text-white animate-pulse" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">V-Buzz Platform</p>
                <p className="text-xs text-gray-600">Department Suite</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Version 2.1.0</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                    {currentPage.label}
                  </h1>
                  {currentPage.badge && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {currentPage.badge}
                    </span>
                  )}
                  {currentPage.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <p className="text-gray-600 text-sm mt-1">{currentPage.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl px-3 py-2 border border-gray-200">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-200">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-gray-600">{user?.role || 'Department Admin'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isFetchingAll && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-indigo-50/20 overflow-auto">
          <div className="max-w-full">
            {components[activeComponent]}
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {isFetchingAll && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-semibold text-gray-900">Loading Dashboard</p>
                <p className="text-sm text-gray-600">Fetching latest data...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentDashboard;