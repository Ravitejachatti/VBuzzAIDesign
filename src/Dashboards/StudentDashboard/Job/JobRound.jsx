import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  Search, 
  Target, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Briefcase,
  Users,
  MessageSquare,
  Award
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JobRound = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [noRoundsMessage, setNoRoundsMessage] = useState("");
  const [showNoRoundsPopup, setShowNoRoundsPopup] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [expandedMessages, setExpandedMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("Student token");

  const { universityName } = useParams();

  // Toggle job description expansion
  const toggleDescription = (jobId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // Toggle round message expansion
  const toggleMessage = (roundIndex) => {
    setExpandedMessages(prev => ({
      ...prev,
      [roundIndex]: !prev[roundIndex]
    }));
  };

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/student/jobs/getEligibleJobs?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Jobs data:", response.data);
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch job opportunities. Please try again later.");
        setLoading(false);
      }
    };
    fetchJobs();
  }, [universityName]);

  // Filter jobs by department and search term
  useEffect(() => {
    const departmentId = localStorage.getItem("department");
    if (jobs.length > 0 && departmentId) {
      let filtered = jobs.filter((job) => job.departments.includes(departmentId));
      
      if (searchTerm) {
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm]);

  // Fetch rounds for the selected job
  const fetchRounds = async (jobId) => {
    try {
      setLoading(true);
      setRounds([]);
      setNoRoundsMessage("");
      setShowNoRoundsPopup(false);
      const response = await axios.get(
        `${BASE_URL}/student/rounds/getRoundStatus?universityName=${encodeURIComponent(universityName)}`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setRounds(response.data);
        setModalData(response.data);
      } 
      else if(response.data.length === 0) {
        setNoRoundsMessage("No rounds have been added for this job. You will be notified if there are any updates.");
        setShowNoRoundsPopup(true);
      }
    } catch (err) {
      alert("No round status. Please try again later.",err);
      setError("Error fetching round status. Please try again later.",err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setCurrentRoundIndex(0);

  const closeModal = () => {
    setModalData([]);
    setNoRoundsMessage("");
  };

  const handleNextRound = () => {
    if (currentRoundIndex < modalData.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    }
  };

  // Function to truncate text
  const truncateText = (text, limit = 100) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'selected':
      case 'qualified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'in progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'selected':
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'in progress':
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
          <p className="text-gray-600">Loading interview rounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              Interview Round Tracker
            </h2>
            <p className="text-gray-600 mt-2">Monitor your interview progress and round updates</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{filteredJobs.length}</div>
              <div className="text-sm opacity-90">Applied Jobs</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-blue-900 font-medium mb-1">How to Track Your Rounds</h3>
            <p className="text-blue-700 text-sm">
              Click on the "View Rounds" button for any job you've applied to see detailed updates about different interview rounds and your progress status.
            </p>
          </div>
        </div>
      </div>

      {/* Job Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div key={job._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Job Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {index + 1}. {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Applied
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">Min. {job.minPercentage}% required</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Applied: {new Date(job.closingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {expandedDescriptions[job._id] ? job.description : truncateText(job.description)}
                  {job.description && job.description.length > 100 && (
                    <button 
                      onClick={() => toggleDescription(job._id)} 
                      className="text-blue-600 hover:text-blue-800 ml-2 font-medium inline-flex items-center"
                    >
                      {expandedDescriptions[job._id] ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Show More
                        </>
                      )}
                    </button>
                  )}
                </p>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedJobId(job._id);
                    fetchRounds(job._id);
                    openModal();
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Target className="w-5 h-5 mr-2" />
                  View Interview Rounds
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Applied Jobs Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? "Try adjusting your search criteria to find applied jobs."
              : "You haven't applied to any jobs yet. Start applying to track your interview rounds here."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Loading and Error Messages */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-700 font-medium">Loading round details...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Modal for Round Details */}
      {modalData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{modalData[currentRoundIndex].roundName}</h3>
                  <p className="text-blue-100 mt-1">
                    Round {currentRoundIndex + 1} of {modalData.length}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border-2 border-white/30 ${getStatusColor(modalData[currentRoundIndex].status)}`}>
                  <div className="flex items-center">
                    {getStatusIcon(modalData[currentRoundIndex].status)}
                    <span className="ml-2 font-medium">{modalData[currentRoundIndex].status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Round Details
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {expandedMessages[currentRoundIndex] 
                        ? modalData[currentRoundIndex].roundDescription 
                        : truncateText(modalData[currentRoundIndex].roundDescription, 200)}
                      {modalData[currentRoundIndex].roundDescription && 
                        modalData[currentRoundIndex].roundDescription.length > 200 && (
                        <button 
                          onClick={() => toggleMessage(currentRoundIndex)} 
                          className="text-blue-600 hover:text-blue-800 ml-2 font-medium"
                        >
                          {expandedMessages[currentRoundIndex] ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                    </p>
                  </div>
                </div>

                {/* Round Progress */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Round Progress</h4>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    {modalData.map((round, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === currentRoundIndex 
                            ? 'bg-blue-500 text-white' 
                            : index < currentRoundIndex 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index < currentRoundIndex ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-600 mt-1 text-center max-w-16 truncate">
                          {round.roundName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={handlePrevRound} 
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentRoundIndex === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={currentRoundIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {modalData.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentRoundIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button 
                  onClick={handleNextRound} 
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentRoundIndex === modalData.length - 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={currentRoundIndex === modalData.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <button 
                onClick={closeModal} 
                className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for No Rounds */}
      {showNoRoundsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Rounds Available</h3>
              <p className="text-gray-600 mb-6">{noRoundsMessage}</p>
              <button 
                onClick={() => setShowNoRoundsPopup(false)} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRound;