import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  applyToJob,
  clearApplyStatus,
} from "../../../Redux/StudentDashboard/jobSlice";
import { fetchRounds } from "../../../Redux/StudentDashboard/roundSlice";
import {
  Target, Search, Users, Calendar, Briefcase, Building2
} from "lucide-react";

const JobRound = () => {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [expandedMessages, setExpandedMessages] = useState({});
  const [showNoRoundsPopup, setShowNoRoundsPopup] = useState(false);
  const [noRoundsMessage, setNoRoundsMessage] = useState("");
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { universityName } = useParams();
  const token = localStorage.getItem("Student token");
  const user = localStorage.getItem("user");

  const dispatch = useDispatch();

  // Redux states
  const {
    eligibleJobs,
    loading,
    error,
    applyingJobIds,
    applyError,
    applySuccessMessage,
  } = useSelector((state) => state.job);
  const jobLoading = useSelector((state) => state.job.loading);
  const jobError = useSelector((state) => state.job.error);

  const rounds = useSelector((state) => state.round.rounds);
  const roundLoading = useSelector((state) => state.round.loading);
  const roundError = useSelector((state) => state.round.error);

  // Fetch jobs when component mounts
  useEffect(() => {
    if (universityName) {
      dispatch(fetchJobs({ universityName }));
    }
  }, [dispatch, universityName]);

  // Filter jobs by department
  const departmentId = user ? JSON.parse(user).department : null;
  const filteredJobs = eligibleJobs?.filter((job) =>
    departmentId ? job.departments.includes(departmentId) : true
  ) || [];

  // Search filter (title/company)
  const filteredData = filteredJobs.filter((item) => {
    const title = item?.title || "";
    const company = item?.company || "";
    const term = searchTerm.toLowerCase();
    return (
      title.toLowerCase().includes(term) ||
      company.toLowerCase().includes(term)
    );
  });

  const toggleDescription = (jobId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const toggleMessage = (roundIndex) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [roundIndex]: !prev[roundIndex],
    }));
  };

  const fetchRoundsForJob = (jobId) => {
    dispatch(fetchRounds({ jobId, universityName, token }))
      .unwrap()
      .then((fetchedRounds) => {
        if (fetchedRounds && fetchedRounds?.length) {
          setShowRoundsModal(true);
          setCurrentRoundIndex(0);
        }
        if (fetchedRounds?.length == 0) {
          alert("No rounds available for this job.");
          setNoRoundsMessage(
            "No rounds have been added for this job. You will be notified if there are any updates."
          );
          setShowNoRoundsPopup(true);
          setShowRoundsModal(false);
        }
      })
      .catch((err) => {
        setNoRoundsMessage("Failed to fetch round status. Please try again later.");
        setShowNoRoundsPopup(true);
        setShowRoundsModal(false);
      });
  };

  const handleNextRound = () => {
    if (currentRoundIndex < rounds?.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    }
  };

  const closeModal = () => {
    setNoRoundsMessage("");
    setShowNoRoundsPopup(false);
    setShowRoundsModal(false);
  };

  const truncateText = (text, limit = 100) => {
    return text && text?.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  // Keep existing combined loading (no logic change)
  if (jobLoading || roundLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with icon + job count pill */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Interview Round Tracker
        </h2>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-4 py-1.5 rounded-full shadow">
          {filteredData.length} Jobs
        </div>
      </div>

      {/* Search input with icon */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by job title or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-md pl-10 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Jobs grid with modern cards */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No Jobs Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((job, index) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200 p-4 space-y-2"
            >
              <div>
                <h4 className="text-base font-semibold truncate">
                  <Building2 className="inline w-4 h-4 mr-1 text-gray-400" />
                  {index + 1}. {job.company}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  <Briefcase className="inline w-4 h-4 mr-1 text-gray-400" />
                  {job.title}
                </p>
                <p className="text-sm mt-2 text-gray-600">
                  {expandedDescriptions[job._id]
                    ? job.description
                    : truncateText(job.description)}
                  {job?.description && job?.description?.length > 100 && (
                    <button
                      onClick={() => toggleDescription(job._id)}
                      className="text-blue-500 ml-2 text-sm"
                    >
                      {expandedDescriptions[job._id] ? "View Less" : "View More"}
                    </button>
                  )}
                </p>
              </div>

              <div className="space-y-1 text-sm mt-2">
                <p>
                  <Users className="inline w-4 h-4 mr-1 text-gray-400" />
                  Min. {job?.minPercentage ?? "-"}% required
                </p>
                <p>
                  <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                  Closing:{" "}
                  {job?.closingDate
                    ? new Date(job.closingDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedJobId(job._id);
                  fetchRoundsForJob(job._id);
                }}
                className="w-full px-4 py-2 mt-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Rounds
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error messages (kept) */}
      {jobError && <div className="text-center text-red-600 text-sm font-medium">{jobError}</div>}
      {roundError && <div className="text-center text-red-600 text-sm font-medium">{roundError}</div>}

      {/* Modal for Round Details (modern styles) */}
      {showRoundsModal && rounds?.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2 text-center">
              Round Details for {filteredJobs.find((job) => job._id === selectedJobId)?.title}
            </h2>
            <h3 className="text-lg font-semibold mb-1 text-center underline">
              {rounds[currentRoundIndex].roundName} (Round {currentRoundIndex + 1} of {rounds?.length})
            </h3>
            <p className="mb-2">
              <strong>Message:</strong>{" "}
              {expandedMessages[currentRoundIndex]
                ? rounds[currentRoundIndex].roundDescription
                : truncateText(rounds[currentRoundIndex].roundDescription, 150)}
              {rounds[currentRoundIndex].roundDescription?.length > 150 && (
                <button
                  onClick={() => toggleMessage(currentRoundIndex)}
                  className="text-blue-500 ml-2 text-sm"
                >
                  {expandedMessages[currentRoundIndex] ? "View Less" : "View More"}
                </button>
              )}
            </p>
            <p><strong>Status:</strong> {rounds[currentRoundIndex].status}</p>
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
                disabled={currentRoundIndex === rounds?.length - 1}
              >
                Next
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup for No Rounds (kept) */}
      {showNoRoundsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p className="text-gray-700 mb-4">{noRoundsMessage}</p>
            <button
              onClick={() => setShowNoRoundsPopup(false)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRound;
