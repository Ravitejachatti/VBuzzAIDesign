import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

function DashboardOverview({ 
  departmentId, 
  departmentName, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs 
}) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalPrograms: 0,
    activeJobs: 0,
    placementRate: 0,
    averageGPA: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'student',
      title: 'New Student Enrollment',
      description: '15 new students enrolled in Computer Science program',
      time: '2 hours ago',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 2,
      type: 'faculty',
      title: 'Faculty Achievement',
      description: 'Dr. Smith published a research paper in IEEE',
      time: '5 hours ago',
      icon: Award,
      color: 'green'
    },
    {
      id: 3,
      type: 'job',
      title: 'New Job Posting',
      description: 'Software Engineer position added by TechCorp',
      time: '1 day ago',
      icon: Briefcase,
      color: 'purple'
    },
    {
      id: 4,
      type: 'program',
      title: 'Course Update',
      description: 'Machine Learning course curriculum updated',
      time: '2 days ago',
      icon: BookOpen,
      color: 'orange'
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Department Faculty Meeting',
      date: '2024-01-20',
      time: '10:00 AM',
      type: 'meeting',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Student Orientation Program',
      date: '2024-01-22',
      time: '2:00 PM',
      type: 'event',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Industry Expert Lecture',
      date: '2024-01-25',
      time: '11:00 AM',
      type: 'lecture',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Mid-term Examinations',
      date: '2024-01-28',
      time: '9:00 AM',
      type: 'exam',
      priority: 'urgent'
    }
  ]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setStats({
      totalStudents: 245,
      totalFaculty: 18,
      totalPrograms: 6,
      activeJobs: 12,
      placementRate: 87.5,
      averageGPA: 8.2
    });
  }, [departmentId]);

  const StatCard = ({ title, value, change, changeType, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-500 to-blue-600' :
          color === 'green' ? 'from-green-500 to-green-600' :
          color === 'purple' ? 'from-purple-500 to-purple-600' :
          color === 'orange' ? 'from-orange-500 to-orange-600' :
          color === 'red' ? 'from-red-500 to-red-600' :
          'from-gray-500 to-gray-600'
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeType === 'increase' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {changeType === 'increase' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {value}
        </h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
          activity.color === 'green' ? 'bg-green-100 text-green-600' :
          activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
          activity.color === 'orange' ? 'bg-orange-100 text-orange-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
        </div>
      </div>
    );
  };

  const EventItem = ({ event }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{event.title}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">{event.date}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">{event.time}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
          {event.priority}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to {departmentName} Department
            </h1>
            <p className="text-blue-100 text-lg">
              Monitor your department's performance and manage operations efficiently
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            change="+12%"
            changeType="increase"
            icon={GraduationCap}
            color="blue"
            subtitle="Across all programs"
          />
          <StatCard
            title="Faculty Members"
            value={stats.totalFaculty}
            change="+2"
            changeType="increase"
            icon={Users}
            color="green"
            subtitle="Active faculty"
          />
          <StatCard
            title="Academic Programs"
            value={stats.totalPrograms}
            icon={BookOpen}
            color="purple"
            subtitle="Undergraduate & Graduate"
          />
          <StatCard
            title="Active Job Postings"
            value={stats.activeJobs}
            change="+5"
            changeType="increase"
            icon={Briefcase}
            color="orange"
            subtitle="Current opportunities"
          />
          <StatCard
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            change="+3.2%"
            changeType="increase"
            icon={Target}
            color="green"
            subtitle="This academic year"
          />
          <StatCard
            title="Average GPA"
            value={stats.averageGPA}
            change="+0.1"
            changeType="increase"
            icon={Star}
            color="blue"
            subtitle="Department average"
          />
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Performance Metrics</h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Student Satisfaction</span>
                <span className="text-sm font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Faculty Performance</span>
                <span className="text-sm font-bold text-gray-900">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Research Output</span>
                <span className="text-sm font-bold text-gray-900">76%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Industry Collaboration</span>
                <span className="text-sm font-bold text-gray-900">84%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
              <GraduationCap className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Add Student</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
              <Users className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Add Faculty</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
              <BookOpen className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">New Course</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group">
              <Briefcase className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Post Job</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Calendar
            </button>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Important Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Exam Schedule Update</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Mid-term examination schedule has been updated. Please review the new timings.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">New Faculty Orientation</h4>
              <p className="text-sm text-blue-700 mt-1">
                Orientation program for new faculty members scheduled for next week.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800">Accreditation Approved</h4>
              <p className="text-sm text-green-700 mt-1">
                Department has successfully received accreditation for the next 5 years.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;