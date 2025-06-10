import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

  // Filter jobs by department
  useEffect(() => {
    const departmentId = localStorage.getItem("department");
    if (jobs.length > 0 && departmentId) {
      const filtered = jobs.filter((job) => job.departments.includes(departmentId));
      setFilteredJobs(filtered);
    }
  }, [jobs]);

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

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Application Status Tracker</h2>

      {/* Job Grid */}
      <div>
        <label className="block text-gray-600 font-medium mb-2 text-sm">
          Click on the "View Round" button to check the updates of different rounds for the job you have been selected:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div key={job._id} className="bg-white shadow rounded-lg p-4 border border-gray-300">
                <h3 className="text-md font-semibold text-gray-800">{index + 1}. {job.title} ({job.company})</h3>
                <p className="text-gray-600 mb-3">
                  {expandedDescriptions[job._id] ? job.description : truncateText(job.description)}
                  {job.description && job.description.length > 100 && (
                    <button 
                      onClick={() => toggleDescription(job._id)} 
                      className="text-blue-500 ml-2 text-sm"
                    >
                      {expandedDescriptions[job._id] ? 'View Less' : 'View More'}
                    </button>
                  )}
                </p>
                <button
                  onClick={() => {
                    setSelectedJobId(job._id);
                    fetchRounds(job._id);
                    openModal();
                  }}
                  className="w-full text-center px-2 py-1 my-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Rounds
                </button>
              </div>
            ))
          ) : (
            <p>No job found</p>
          )}
        </div>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Modal for Round Details */}
      {modalData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white px-6 py-3 rounded-lg shadow-lg w-5/6 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-1 text-center underline">
              {modalData[currentRoundIndex].roundName} (Round {currentRoundIndex + 1} of {modalData.length})
            </h3>
            <p className="mb-2">
              <strong>Message:</strong> 
              <span className="ml-1">
                {expandedMessages[currentRoundIndex] 
                  ? modalData[currentRoundIndex].roundDescription 
                  : truncateText(modalData[currentRoundIndex].roundDescription, 150)}
                {modalData[currentRoundIndex].roundDescription && 
                  modalData[currentRoundIndex].roundDescription.length > 150 && (
                  <button 
                    onClick={() => toggleMessage(currentRoundIndex)} 
                    className="text-blue-500 ml-2 text-sm"
                  >
                    {expandedMessages[currentRoundIndex] ? 'View Less' : 'View More'}
                  </button>
                )}
              </span>
            </p>
            <p><strong>Status:</strong> {modalData[currentRoundIndex].status}</p>
            <div className="flex justify-between mt-4">
              <button 
                onClick={handlePrevRound} 
                className="px-4 py-2 bg-gray-300 rounded" 
                disabled={currentRoundIndex === 0}
              >
                Previous
              </button>
              <button 
                onClick={handleNextRound} 
                className="px-4 py-2 bg-blue-500 text-white rounded" 
                disabled={currentRoundIndex === modalData.length - 1}
              >
                Next
              </button>
            </div>
            <button onClick={closeModal} className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded">Close</button>
          </div>
        </div>
      )}

      {/* Popup for No Rounds */}
      {showNoRoundsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p className="text-gray-700 mb-4">{noRoundsMessage}</p>
            <button onClick={() => setShowNoRoundsPopup(false)} className="w-full px-4 py-2 bg-blue-500 text-white rounded">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRound;