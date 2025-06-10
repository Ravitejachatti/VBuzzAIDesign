import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  FileText, 
  Download, 
  ExternalLink,
  Building2,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Users,
  Briefcase
} from 'lucide-react';

const PlacementAnalysis = ({ studnets }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  console.log("Student Data in Placement Analysis:", studnets);
  const placements = studnets?.student?.placements || [];

  const totalApplied = placements.length;
  const selectedCompanies = placements.filter(company => company.status === "Hired");
  const totalSelected = selectedCompanies.length;
  const totalOfferLetters = selectedCompanies.filter(company => company.offerLetterLink).length;
  const pendingApplications = placements.filter(company => company.status === "Applied" || company.status === "In Progress").length;

  // Calculate average CTC
  const avgCTC = selectedCompanies.length > 0 
    ? selectedCompanies.reduce((sum, company) => sum + (company.ctc || 0), 0) / selectedCompanies.length 
    : 0;

  // Get highest CTC
  const highestCTC = selectedCompanies.length > 0 
    ? Math.max(...selectedCompanies.map(company => company.ctc || 0))
    : 0;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplied,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Companies Selected",
      value: totalSelected,
      icon: Building2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Offer Letters",
      value: totalOfferLetters,
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Pending Applications",
      value: pendingApplications,
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Hired':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Applied':
      case 'In Progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Applied':
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading placement analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              Placement Analysis & Reports
            </h2>
            <p className="text-gray-600 mt-2">Track your placement journey and analyze your progress</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      {totalSelected > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Average CTC</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ₹{avgCTC.toLocaleString()}
            </div>
            <p className="text-gray-600">Based on {totalSelected} offers</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Highest CTC</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{highestCTC.toLocaleString()}
            </div>
            <p className="text-gray-600">Best offer received</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'offers', label: 'Offers', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Success Rate</h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {totalApplied > 0 ? Math.round((totalSelected / totalApplied) * 100) : 0}%
                  </div>
                  <p className="text-blue-700 text-sm">Applications to offers ratio</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">Offer Conversion</h4>
                  <div className="text-3xl font-bold text-green-600">
                    {totalSelected > 0 ? Math.round((totalOfferLetters / totalSelected) * 100) : 0}%
                  </div>
                  <p className="text-green-700 text-sm">Selections to offer letters</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-900 mb-2">Active Applications</h4>
                  <div className="text-3xl font-bold text-purple-600">{pendingApplications}</div>
                  <p className="text-purple-700 text-sm">Currently in progress</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              {placements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CTC
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {placements.map((placement, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {placement.companyName || '-'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.role || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {placement.ctc ? `₹${placement.ctc.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(placement.status)}`}>
                              {getStatusIcon(placement.status)}
                              <span className="ml-1">{placement.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {placement.offerLetterLink ? (
                              <a
                                href={placement.offerLetterLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View Offer
                              </a>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600">Start applying to companies to track your progress here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-4">
              {selectedCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCompanies.map((offer, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-green-900">{offer.companyName}</h4>
                          <p className="text-green-700 font-medium">{offer.role}</p>
                        </div>
                        <Award className="w-8 h-8 text-green-600" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-green-800">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="font-semibold">CTC: ₹{offer.ctc?.toLocaleString() || 'Not specified'}</span>
                        </div>
                        
                        {offer.additionalDetails && (
                          <div className="flex items-start text-green-800">
                            <FileText className="w-4 h-4 mr-2 mt-0.5" />
                            <span className="text-sm">{offer.additionalDetails}</span>
                          </div>
                        )}
                        
                        {offer.offerLetterLink && (
                          <div className="pt-3">
                            <a
                              href={offer.offerLetterLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Offer Letter
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
                  <p className="text-gray-600">Keep applying and interviewing to receive job offers.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalysis;