import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building, 
  TrendingUp, 
  Award, 
  Calendar,
  BookOpen,
  Briefcase,
  Bell,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';

const DashboardOverview = ({ 
  collegeId, 
  token, 
  colleges, 
  departments, 
  programs, 
  CollegeName, 
  user 
}) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    totalPrograms: 0,
    placementRate: 0,
    activeJobs: 0,
    recentNotices: 0,
    upcomingEvents: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'student', message: 'New student registration completed', time: '2 hours ago', icon: Users },
    { id: 2, type: 'placement', message: 'Placement drive scheduled for next week', time: '4 hours ago', icon: Briefcase },
    { id: 3, type: 'faculty', message: 'Faculty meeting scheduled', time: '6 hours ago', icon: GraduationCap },
    { id: 4, type: 'notice', message: 'New notice published', time: '1 day ago', icon: Bell },
  ]);

  const [quickActions] = useState([
    { id: 'students', label: 'Manage Students', icon: Users, color: 'blue', description: 'View and manage student records' },
    { id: 'faculty', label: 'Faculty Management', icon: GraduationCap, color: 'green', description: 'Manage faculty members' },
    { id: 'departments', label: 'Departments', icon: Building, color: 'purple', description: 'Add and manage departments' },
    { id: 'reports', label: 'Placement Reports', icon: TrendingUp, color: 'orange', description: 'View placement analytics' },
  ]);

  useEffect(() => {
    // Calculate stats from available data
    setStats({
      totalStudents: 1250, // This would come from API
      totalFaculty: departments.length * 8, // Estimated
      totalDepartments: departments.length,
      totalPrograms: programs.length,
      placementRate: 85,
      activeJobs: 24,
      recentNotices: 8,
      upcomingEvents: 5
    });
  }, [departments, programs]);

  const StatCard = ({ title, value, icon: Icon, color, trend, description }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ action, onClick }) => (
    <button
      onClick={() => onClick(action.id)}
      className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105 text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 flex items-center justify-center`}>
            <action.icon className={`w-6 h-6 text-${action.color}-600`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{action.label}</h3>
            <p className="text-sm text-gray-500">{action.description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </button>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center`}>
        <activity.icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}!</h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening at {CollegeName} today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Building className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={Users}
          color="blue"
          trend={12}
          description="Active enrollments"
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalFaculty}
          icon={GraduationCap}
          color="green"
          trend={5}
          description="Teaching staff"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building}
          color="purple"
          description="Academic divisions"
        />
        <StatCard
          title="Programs"
          value={stats.totalPrograms}
          icon={BookOpen}
          color="orange"
          description="Available courses"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${stats.placementRate}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{stats.placementRate}%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900">Placement Rate</h4>
                <p className="text-sm text-gray-500">Current academic year</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Job Openings</span>
                  <span className="font-semibold text-gray-900">{stats.activeJobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recent Notices</span>
                  <span className="font-semibold text-gray-900">{stats.recentNotices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Upcoming Events</span>
                  <span className="font-semibold text-gray-900">{stats.upcomingEvents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
          
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activities
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <Target className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              action={action}
              onClick={(actionId) => {
                // Handle quick action clicks
                console.log('Quick action clicked:', actionId);
              }}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Placement Drive</h4>
                <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Faculty Meeting</h4>
                <p className="text-sm text-gray-600">Dec 28, 2:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Awards Ceremony</h4>
                <p className="text-sm text-gray-600">Jan 5, 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;