import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  GraduationCap, 
  Award, 
  Target,
  FileText,
  ChevronDown,
  RefreshCw,
  Eye,
  Share2,
  Printer,
  Mail,
  ExternalLink
} from 'lucide-react';

function DepartmentReports({ 
  departmentId, 
  departmentName, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs 
}) {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('current-year');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [reportData, setReportData] = useState({
    overview: {
      totalStudents: 245,
      totalFaculty: 18,
      placementRate: 87.5,
      averageGPA: 8.2,
      researchProjects: 12,
      publications: 45
    },
    studentMetrics: {
      enrollmentTrend: [
        { year: '2020', students: 180 },
        { year: '2021', students: 195 },
        { year: '2022', students: 220 },
        { year: '2023', students: 235 },
        { year: '2024', students: 245 }
      ],
      programDistribution: [
        { program: 'Computer Science', students: 120, percentage: 49 },
        { program: 'Information Technology', students: 85, percentage: 35 },
        { program: 'Data Science', students: 40, percentage: 16 }
      ],
      performanceMetrics: {
        excellent: 45,
        good: 120,
        average: 65,
        needsImprovement: 15
      }
    },
    facultyMetrics: {
      designationDistribution: [
        { designation: 'Professor', count: 5 },
        { designation: 'Associate Professor', count: 7 },
        { designation: 'Assistant Professor', count: 6 }
      ],
      researchOutput: {
        publications: 45,
        conferences: 28,
        patents: 3,
        grants: 8
      },
      teachingLoad: {
        average: 12,
        maximum: 18,
        minimum: 8
      }
    },
    placementMetrics: {
      placementRate: 87.5,
      averagePackage: 8.5,
      topRecruiters: [
        { company: 'TechCorp', hires: 25 },
        { company: 'InnovateSoft', hires: 18 },
        { company: 'DataSystems', hires: 15 },
        { company: 'CloudTech', hires: 12 }
      ],
      sectorDistribution: [
        { sector: 'IT Services', percentage: 45 },
        { sector: 'Product Companies', percentage: 30 },
        { sector: 'Consulting', percentage: 15 },
        { sector: 'Others', percentage: 10 }
      ]
    }
  });

  const reportTypes = [
    { id: 'overview', name: 'Department Overview', icon: BarChart3 },
    { id: 'students', name: 'Student Analytics', icon: GraduationCap },
    { id: 'faculty', name: 'Faculty Performance', icon: Users },
    { id: 'placements', name: 'Placement Report', icon: Target },
    { id: 'research', name: 'Research Output', icon: Award },
    { id: 'academic', name: 'Academic Performance', icon: FileText }
  ];

  const dateRanges = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'current-semester', label: 'Current Semester' },
    { value: 'current-year', label: 'Current Academic Year' },
    { value: 'last-year', label: 'Last Academic Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleExportReport = (format) => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Report exported as ${format.toUpperCase()}`);
    }, 2000);
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-500 to-blue-600' :
          color === 'green' ? 'from-green-500 to-green-600' :
          color === 'purple' ? 'from-purple-500 to-purple-600' :
          color === 'orange' ? 'from-orange-500 to-orange-600' :
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
            <TrendingUp className={`w-3 h-3 ${changeType === 'decrease' ? 'rotate-180' : ''}`} />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );

  const OverviewReport = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Students"
          value={reportData.overview.totalStudents}
          change="+12%"
          changeType="increase"
          icon={GraduationCap}
          color="blue"
        />
        <MetricCard
          title="Faculty Members"
          value={reportData.overview.totalFaculty}
          change="+2"
          changeType="increase"
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Placement Rate"
          value={`${reportData.overview.placementRate}%`}
          change="+3.2%"
          changeType="increase"
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Average GPA"
          value={reportData.overview.averageGPA}
          change="+0.1"
          changeType="increase"
          icon={Award}
          color="orange"
        />
        <MetricCard
          title="Research Projects"
          value={reportData.overview.researchProjects}
          change="+4"
          changeType="increase"
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Publications"
          value={reportData.overview.publications}
          change="+8"
          changeType="increase"
          icon={Award}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Student Enrollment Trend</h3>
          <div className="space-y-4">
            {reportData.studentMetrics.enrollmentTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.year}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.students / 250) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-medium w-12">{item.students}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Program Distribution</h3>
          <div className="space-y-4">
            {reportData.studentMetrics.programDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{item.program}</span>
                  <span className="text-gray-900 font-medium">{item.students} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PlacementReport = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Placement Rate</p>
              <p className="text-3xl font-bold">{reportData.placementMetrics.placementRate}%</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Avg Package</p>
              <p className="text-3xl font-bold">₹{reportData.placementMetrics.averagePackage}L</p>
            </div>
            <Award className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Companies</p>
              <p className="text-3xl font-bold">{reportData.placementMetrics.topRecruiters.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Placed</p>
              <p className="text-3xl font-bold">214</p>
            </div>
            <GraduationCap className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Recruiters</h3>
          <div className="space-y-4">
            {reportData.placementMetrics.topRecruiters.map((recruiter, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{recruiter.company}</span>
                </div>
                <span className="text-blue-600 font-bold">{recruiter.hires} hires</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sector Distribution</h3>
          <div className="space-y-4">
            {reportData.placementMetrics.sectorDistribution.map((sector, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{sector.sector}</span>
                  <span className="text-gray-900 font-medium">{sector.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      'bg-gradient-to-r from-orange-500 to-orange-600'
                    }`}
                    style={{ width: `${sector.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return <OverviewReport />;
      case 'placements':
        return <PlacementReport />;
      case 'students':
        return <OverviewReport />; // Placeholder
      case 'faculty':
        return <OverviewReport />; // Placeholder
      case 'research':
        return <OverviewReport />; // Placeholder
      case 'academic':
        return <OverviewReport />; // Placeholder
      default:
        return <OverviewReport />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Department Reports & Analytics</h2>
          <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleExportReport('pdf')}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExportReport('excel')}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  selectedReport === report.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{report.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Programs</option>
              <option value="cs">Computer Science</option>
              <option value="it">Information Technology</option>
              <option value="ds">Data Science</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>

          <div className="flex items-center space-x-2">
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-gray-50 rounded-2xl p-6">
        {renderReportContent()}
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Student enrollment has increased by 12% compared to last year</li>
              <li>• Placement rate improved by 3.2% reaching 87.5%</li>
              <li>• Faculty research output increased with 8 new publications</li>
              <li>• Average GPA improved by 0.1 points</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Focus on improving placement rates in emerging technologies</li>
              <li>• Increase industry collaboration for better job opportunities</li>
              <li>• Enhance research funding to boost publication output</li>
              <li>• Implement mentorship programs for academic improvement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentReports;