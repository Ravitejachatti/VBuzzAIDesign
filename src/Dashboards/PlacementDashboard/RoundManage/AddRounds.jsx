import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
// import { set } from "react-datepicker/dist/date_utils";

const AddRound = ({ departments }) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [jobs, setJobs] = useState([]); // Stores all jobs
  const [rounds, setRounds] = useState([]); // Stores rounds for a specific job
  const [applicants, setApplicants] = useState([]); // Stores applicants for a specific round
  const [selectedJobId, setSelectedJobId] = useState(null); // Currently selected job ID
  const [selectedJobTitle, setSelectedJobTitle] = useState(""); // Currently selected job title
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null); // Currently selected round index
  const [showRoundsModal, setShowRoundsModal] = useState(false); // Flag to show rounds modal
  const [showApplicantsModal, setShowApplicantsModal] = useState(false); // Flag to show applicants modal
  const [showAddRoundModal, setShowAddRoundModal] = useState(false); // Flag to show add round modal
  const [showUpdateRoundModal, setShowUpdateRoundModal] = useState(false); // Flag to show update round modal
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Selected department for filtering jobs
  const [filteredJobs, setFilteredJobs] = useState([]); // Filtered jobs based on department
  const [message, setMessage] = useState("");





  const [roundData, setRoundData] = useState({
    name: "",
    description: "",
    pdfLink: "",
    examLink: "",
  });

  const [updateRoundData, setUpdateRoundData] = useState({
    name: "",
    description: "",
    pdfLink: "",
    examLink: "",
  });
  const token = localStorage.getItem("University authToken");

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/job/getAllJobs?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jobsData = Array.isArray(response.data.data) ? response.data.data : [];
        // Sort jobs by closing date in descending order (latest first)
    const sortedJobs = [...jobsData].sort((a, b) => {
      return new Date(b.closingDate) - new Date(a.closingDate);
    });
          
      setJobs(sortedJobs);
      setFilteredJobs(sortedJobs);
      console.log("FilteredJobs", filteredJobs)
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Error fetching jobs. Please try again.");
    }
  };


  // Fetch rounds for a specific job
  const fetchRounds = async (jobId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/getAllRounds?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response", response)
      console.log("Response Data", response?.data?.data[0]?.rounds[0]?.name)
      const rounds = response?.data?.data[0]?.rounds;
      setRounds(rounds);

      const roundN = response?.data?.data[0]?.rounds[0]?.name || [];
      console.log("roundN", roundN)
      setMessage(response?.data);

    } catch (error) {
      console.error("Error fetching rounds:", error);
      setMessage("Error fetching rounds. Please try again."); // ✅ Improved error handling
    }
  };

  // Filter jobs by department
  const handleDepartmentFilter = (deptId) => {
    setSelectedDepartment(deptId);
    if (deptId === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) => job.departments.includes(deptId));
      setFilteredJobs(filtered);
    }
  };
  // Get department name by ID
  const getDepartmentName = (deptIds) => {
    return deptIds
      .map((id) => {
        const dept = departments.find((dept) => dept._id === id);
        return dept ? dept.name : "Unknown";
      })
      .join(", ");
  };

  // Show applicants for a round
  const handleViewApplicants = (round) => {
    setApplicants(round.applicants || []);
    setShowApplicantsModal(true);
  };

  // Handle file upload for applicants
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const formattedApplicants = data.map((row) => ({
        registered_number: row.registered_number,
        name: row.name,
        status: row.status || "selected",
        feedback: row.feedback || "",
      }));
      setApplicants(formattedApplicants);
    };

    reader.readAsBinaryString(file);
  };

  // Handle adding a round
  const handleAddRound = async () => {
    if (!roundData.name || !roundData.description) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/job/jobs/${selectedJobId}/addRounds?universityName=${universityName}`,
        { roundData, applicants },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      alert("Round added successfully.");
      setRoundData({ name: "", description: "", pdfLink: "", examLink: "" });
      setApplicants([]);
      setShowAddRoundModal(false);
      fetchRounds(selectedJobId);
    } catch (error) {
      console.error("Error adding round:", error);
      alert("Failed to add round. Please try again.");
    }
  };

  // Handle updating a round
  const handleUpdateRound = async () => {
    if (selectedRoundIndex === null) {
      alert("Please select a round to update.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/job/jobs/${selectedJobId}/updateRounds/${selectedRoundIndex}?universityName=${universityName}`,
        updateRoundData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );
      alert("Round updated successfully.");
      fetchRounds(selectedJobId);
      setUpdateRoundData({ name: "", description: "", pdfLink: "", examLink: "" });
      setSelectedRoundIndex(null);
      setShowUpdateRoundModal(false);
    } catch (error) {
      console.error("Error updating round:", error);
      alert("Failed to update round. Please try again.");
    }
  };

  // Handle deleting a round
  const handleDeleteRound = async (roundIndex) => {
    try {
      await axios.delete(
        `${BASE_URL}/job/jobs/${selectedJobId}/deleteRounds/${roundIndex}?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Round deleted successfully.");
      fetchRounds(selectedJobId);
    } catch (error) {
      console.error("Error deleting round:", error);
      alert("Failed to delete round. Please try again.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [universityName]);

  return (
    <div className=" h-screen">
      {/* Department Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Filter by Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => handleDepartmentFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
      <div className=" mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manage Rounds</h2>
        {/* Job Cards */}
        <div className=" gap-6">
          {/* Job Cards */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <div key={job._id} className=" w-full border rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold">{index + 1}.{job.title}</h3>
                  <p className="text-sm">Departments: {getDepartmentName(job.departments)}</p>
                  <p className="text-sm">Closing Date: {new Date(job.closingDate).toLocaleDateString()}</p>
                  <div className="mt-4 ">
                    <button
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setSelectedJobTitle(job.title);
                        fetchRounds(job._id);
                        setShowRoundsModal(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 mr-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setSelectedJobTitle(job.title);
                        setShowAddRoundModal(true);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              No jobs available for the selected department.
            </div>
          )}

        </div>

        {showRoundsModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-10">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] max-h-[80vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4">Rounds of {selectedJobTitle}</h2>
      <div className="overflow-y-auto flex-grow">
        {rounds && rounds.length > 0 ? (
          <ul className="space-y-3">
            {rounds.map((round, index) => (
              <li key={round._id || index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {index + 1}. {round?.name || "No Name"}
                    </p>
                    <p>
                      <strong>Description:</strong> {round?.description || "No Description"}
                    </p>
                    <p>
                      <strong>Exam Link:</strong>
                      {round?.examLink ? (
                        <a
                          href={round.examLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline ml-1"
                        >
                          {round.examLink}
                        </a>
                      ) : (
                        " Not Available"
                      )}
                    </p>
                    <p>
                      <strong>PDF Link:</strong>
                      {round?.pdfLink ? (
                        <a
                          href={round.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 underline ml-1"
                        >
                          View PDF
                        </a>
                      ) : (
                        " Not Available"
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewApplicants(round)}
                      className="bg-purple-500 text-white px-3 py-1 rounded-lg"
                    >
                      Applicants
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRoundIndex(index);
                        setUpdateRoundData(round);
                        setShowUpdateRoundModal(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRound(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500 font-semibold text-center">
            No rounds found for this job.
          </p>
        )}
      </div>
      <button
        onClick={() => setShowRoundsModal(false)}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        Close
      </button>
    </div>
  </div>
)}





{showApplicantsModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[60vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4">Applicants</h2>
      <div className="overflow-y-scroll">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Registered Number</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{applicant.name}</td>
                <td className="border px-4 py-2">{applicant.registered_number}</td>
                <td className="border px-4 py-2">{applicant.status}</td>
                <td className="border px-4 py-2">{applicant.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowApplicantsModal(false)}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        Close
      </button>
    </div>
  </div>
)}


        {showAddRoundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px]">
              <h2 className="text-xl font-bold mb-1">Add Round for {selectedJobTitle}</h2>
              {/* follow the following template for uploading the studnts for the given rounds: */}
              {/* excel sheet link */}
              <p className="text-sm text-gray-500 mb-1">
        Please upload a .xlsx file with the following columns:
        <ul className="list-disc list-inside">
          <li className="font-bold">name</li>
          <li  className="font-bold">registered_number</li>
          <li className="font-bold" >message(whatever you want)</li>
          <li className="font-bold">feedback(optional)</li>
        </ul>
      </p>
              {/* excel sheet link */}
              <p className="text-sm text-gray-500 mb-1">
                TEMPLATE –{" "}
                <a
                  href="https://docs.google.com/spreadsheets/d/1UhM-_DS4tNH6UfcHSsDZfsEIhjEkOX-8s1ZQAYQE78o/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Sample Sheet
                </a>
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Round Name"
                  value={roundData.name}
                  onChange={(e) => setRoundData({ ...roundData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="Round Description"
                  value={roundData.description}
                  onChange={(e) => setRoundData({ ...roundData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg whitespace-pre-wrap"
                  rows="4"
                ></textarea>
                <input
                  type="text"
                  placeholder="PDF Link"
                  value={roundData.pdfLink}
                  onChange={(e) => setRoundData({ ...roundData, pdfLink: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Exam Link"
                  value={roundData.examLink}
                  onChange={(e) => setRoundData({ ...roundData, examLink: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileUpload}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <button
                onClick={handleAddRound}
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 mr-1"
              >
                Add Round
              </button>
              <button
                onClick={() => setShowAddRoundModal(false)}
                className="mt-4 bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showUpdateRoundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
              <h2 className="text-xl font-bold mb-4">Update Round</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Round Name"
                  value={updateRoundData.name}
                  onChange={(e) => setUpdateRoundData({ ...updateRoundData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="Round Description"
                  value={updateRoundData.description}
                  onChange={(e) => setUpdateRoundData({ ...updateRoundData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                ></textarea>
                <input
                  type="text"
                  placeholder="PDF Link"
                  value={updateRoundData.pdfLink}
                  onChange={(e) => setUpdateRoundData({ ...updateRoundData, pdfLink: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Exam Link"
                  value={updateRoundData.examLink}
                  onChange={(e) => setUpdateRoundData({ ...updateRoundData, examLink: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <button
                  onClick={() => handleViewApplicants(rounds[selectedRoundIndex])}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                  Applicants
                </button>
              </div>
              <button
                onClick={handleUpdateRound}
                className="mt-4 bg-yellow-500 text-white px-2 py-1 mr-1 rounded-lg hover:bg-yellow-600"
              >
                Update Round
              </button>
              <button
                onClick={() => setShowUpdateRoundModal(false)}
                className="mt-4 bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRound;



