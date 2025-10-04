import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  TrendingDown,
  Award,
  Calendar,
  Clock,
  Target,
  Star,
  Activity,
  Zap,
  Database,
  PieChart,
  BarChart,
  LineChart,
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  Briefcase,
  FileText,
  Settings,
  Eye,
  Plus,
  ArrowRight,
  ChevronRight,
  Download,
  Filter,
  Search
} from 'lucide-react';

function DashboardOverview({ 
  collegeName, 
  user, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs, 
  students,
  faculty,
  activeJobs
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('month');


  const LiveClock = React.memo(function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{now.toLocaleTimeString()}</span>;
});

  // useEffect(() => {
  //   const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  //   return () => clearInterval(timer);
  // }, []);
  console.log("active jobs ", activeJobs)
  // Calculate statistics
  const stats = {
    totalStudents: students?.length || 0,
    totalDepartments: departments?.length || 0,
    totalPrograms: programs?.length || 0,
    totalFaculty: faculty.length || 0, // This would come from faculty data
    placementRate: 85,
    activeJobs: activeJobs.length,
    pendingApplications: 28,
    completedPlacements: 156
  };

  console.log("active jobs")


  // Mock data for charts and activities
  const recentActivities = [
    {
      id: 1,
      type: 'student',
      title: 'New student registration',
      description: '15 new students registered for Computer Science',
      time: '2 hours ago',
      icon: Users,
      color: 'blue'
    },
    {
      id: 2,
      type: 'placement',
      title: 'Placement update',
      description: 'Google campus drive scheduled for next week',
      time: '4 hours ago',
      icon: Briefcase,
      color: 'green'
    },
    {
      id: 3,
      type: 'faculty',
      title: 'Faculty meeting',
      description: 'Department heads meeting at 3 PM today',
      time: '6 hours ago',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      id: 4,
      type: 'notice',
      title: 'New notice published',
      description: 'Exam schedule for final semester released',
      time: '1 day ago',
      icon: Bell,
      color: 'orange'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Campus Placement Drive',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Placement',
      participants: 45,
      location: 'Main Auditorium'
    },
    {
      id: 2,
      title: 'Faculty Development Program',
      date: '2024-02-18',
      time: '2:00 PM',
      type: 'Training',
      participants: 12,
      location: 'Conference Hall'
    },
    {
      id: 3,
      title: 'Student Orientation',
      date: '2024-02-20',
      time: '9:00 AM',
      type: 'Academic',
      participants: 120,
      location: 'College Grounds'
    }
  ];

  const quickActions = [
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Register new student',
      icon: Users,
      color: 'blue',
      action: () => console.log('Add student')
    },
    {
      id: 'create-notice',
      title: 'Create Notice',
      description: 'Publish announcement',
      icon: Bell,
      color: 'green',
      action: () => console.log('Create notice')
    },
    {
      id: 'schedule-event',
      title: 'Schedule Event',
      description: 'Plan college event',
      icon: Calendar,
      color: 'purple',
      action: () => console.log('Schedule event')
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: BarChart,
      color: 'orange',
      action: () => console.log('Generate report')
    }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className={`bg-gradient-to-r ${
      color === 'blue' ? 'from-blue-500 to-blue-600' :
      color === 'green' ? 'from-green-500 to-green-600' :
      color === 'purple' ? 'from-purple-500 to-purple-600' :
      color === 'orange' ? 'from-orange-500 to-orange-600' :
      'from-gray-500 to-gray-600'
    } rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-white/80" />
              ) : (
                <TrendingDown className="w-4 h-4 text-white/80" />
              )}
              <span className="text-white/80 text-sm">{change}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          activity.color === 'blue' ? 'bg-blue-100' :
          activity.color === 'green' ? 'bg-green-100' :
          activity.color === 'purple' ? 'bg-purple-100' :
          'bg-orange-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            activity.color === 'blue' ? 'text-blue-600' :
            activity.color === 'green' ? 'text-green-600' :
            activity.color === 'purple' ? 'text-purple-600' :
            'text-orange-600'
          }`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
          <p className="text-gray-600 text-sm">{activity.description}</p>
          <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{event.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          event.type === 'Placement' ? 'bg-green-100 text-green-800' :
          event.type === 'Training' ? 'bg-blue-100 text-blue-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {event.type}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{event.participants} participants</span>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ action }) => {
    const Icon = action.icon;
    return (
      <button
        onClick={action.action}
        className={`w-full p-4 rounded-xl border-2 border-dashed transition-all hover:shadow-lg group ${
          action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
          action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
          action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
          'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            action.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
            action.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
            action.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
            'bg-orange-100 group-hover:bg-orange-200'
          }`}>
            <Icon className={`w-5 h-5 ${
              action.color === 'blue' ? 'text-blue-600' :
              action.color === 'green' ? 'text-green-600' :
              action.color === 'purple' ? 'text-purple-600' :
              'text-orange-600'
            }`} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">{action.title}</h4>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'Admin'}! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                {collegeName}
                 
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100"><LiveClock/></span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-2xl font-bold">{stats.placementRate}%</div>
                <div className="text-blue-100 text-sm">Placement Rate</div>
                <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${stats.placementRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change="+12% this month"
          icon={Users}
          color="blue"
          trend="up"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          change="Active programs"
          icon={Building2}
          color="green"
          trend="up"
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalFaculty}
          change="+3 new hires"
          icon={GraduationCap}
          color="purple"
          trend="up"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          change="5 new postings"
          icon={Briefcase}
          color="orange"
          trend="up"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Analytics */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Placement Analytics</h3>
              <p className="text-gray-600">Monthly placement trends and statistics</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedPlacements}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.activeJobs}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100">
            <div className="text-center">
              <BarChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">Placement Analytics Chart</p>
              <p className="text-sm text-gray-500">Interactive charts would be displayed here</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map(action => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
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
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
              <span>View Calendar</span>
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Department Overview</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
            <span>Manage Departments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments?.slice(0, 6).map((dept, index) => (
            <div key={dept._id || index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                  <p className="text-sm text-gray-600">{dept.head?.name || 'Head TBA'}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">Programs: {dept.programs?.length || 0}</span>
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">System Health</h4>
              <p className="text-sm text-green-600">All systems operational</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Services</span>
              <span className="text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Backup Status</span>
              <span className="text-green-600">Updated</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Data Summary</h4>
              <p className="text-sm text-gray-600">Current semester data</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Records</span>
              <span className="text-gray-900 font-medium">{stats.totalStudents + stats.totalFaculty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Sessions</span>
              <span className="text-gray-900 font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-900 font-medium">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Performance</h4>
              <p className="text-sm text-gray-600">System metrics</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="text-green-600">Fast (120ms)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime</span>
              <span className="text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Load</span>
              <span className="text-yellow-600">Moderate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;