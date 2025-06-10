import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JobOpportunities = ({ studentData }) => {
  const { universityName } = useParams();
  const token = localStorage.getItem("Student token");

  const departmentId = studentData?.student?.department || localStorage.getItem("department");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingJob, setLoadingJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedJobDescription, setSelectedJobDescription] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/student/jobs/getEligibleJobs?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Sort jobs in descending order based on closing date
        const sortedJobs = response.data.sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
        setJobs(sortedJobs);
      } catch (err) {
        setError("Failed to fetch job opportunities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [universityName]);

  const openLinkInNewTab = (url) => {
    window.open(url, "_blank");
  };

  const handleViewDescription = (description) => {
    setSelectedJobDescription(description);
    setViewModalOpen(true);
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-gray-800 mx-2 mb-2">
        Job Opportunities({jobs?.length})
      </h2>
      <div>
        {loading ? (
          <p className="text-gray-600">Loading job opportunities...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 ">
            {jobs.map((job, index) => (
              <div key={job._id} className="bg-white shadow rounded-md p-2 border border-gray-300 p-5">
                <h3 className="text-md font-bold text-gray-800 mb-2">{index+1}.{job.title}</h3>
                <p className="text-gray-600 mb-2"><strong>Company:</strong> {job.company}</p>
                <p className="text-gray-600 mb-2">
                  Description: {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
                  {job.description.length > 100 && (
                    <button
                      onClick={() => handleViewDescription(job.description)}
                      className="text-blue-500 hover:underline ml-1"
                    >
                      View
                    </button>
                  )}
                </p>
                <p className="text-gray-600 mb-2">Min_Percentage: {job.minPercentage}%</p>
                <p className="text-gray-600 mb-2">Status: {job.status}</p>
                <p className="text-gray-600 mb-4">Closing Date: {new Date(job.closingDate).toLocaleDateString()}</p>

                <div className="space-y-2 mx-auto flex justify-between items-center ">
                  {job.linkToPdf && (
                    <button
                      onClick={() => openLinkInNewTab(job.linkToPdf)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View Job
                    </button>
                  )}

{job.linkToApply ? (
  <button
    onClick={async () => {
      if (job.status !== "Closed" && loadingJob !== job._id) {
        setLoadingJob(job._id);
        try {
          const response = await axios.post(
            `${BASE_URL}/student/jobs/${job._id}/apply?universityName=${encodeURIComponent(universityName)}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("Student token")}`,
              },
            }
          );
          if (response.status === 200) {
            alert(response.data.message || "Application recorded successfully!");
            if (job.linkToApply) {
              openLinkInNewTab(job.linkToApply);
            }
          }
        } catch (error) {
          if (
            error.response?.data?.error === 
            "Error adding applicant to job: Student has already applied to this job"
          ) {
            alert("You have already applied. Opening the job link.");
            if (job.linkToApply) {
              openLinkInNewTab(job.linkToApply);
            }
          } else {
            alert(
              error.response?.data?.error + 
              ". Contact Placement office if you want to apply for new Job." ||
              "Failed to apply to job. Please try again later."
            );
          }
        } finally {
          setLoadingJob(null);
        }
      }
    }}
    className={`px-4 py-2 rounded ${loadingJob === job._id
        ? "bg-gray-500 text-white cursor-not-allowed"
        : job.status === "Closed"
          ? "bg-gray-500 text-white cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    disabled={loadingJob === job._id || job.status === "Closed"}
  >
    {loadingJob === job._id ? "Loading..." : job.status === "Closed" ? "Closed" : "Apply Now"}
  </button>
) : (
  <button
    onClick={async () => {
      if (job.status !== "Closed" && loadingJob !== job._id) {
        setLoadingJob(job._id);
        try {
          const response = await axios.post(
            `${BASE_URL}/student/jobs/${job._id}/apply?universityName=${encodeURIComponent(universityName)}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("Student token")}`,
              },
            }
          );
          if (response.status === 200) {
            alert(response.data.message || "Application recorded successfully!");
          }
        } catch (error) {
          alert(
            error.response?.data?.error + 
            ". Contact Placement office if you want to apply for new Job." ||
            "Failed to apply to job. Please try again later."
          );
        } finally {
          setLoadingJob(null);
        }
      }
    }}
    className={`px-4 py-2 rounded ${loadingJob === job._id
        ? "bg-gray-500 text-white cursor-not-allowed"
        : job.status === "Closed"
          ? "bg-gray-500 text-white cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    disabled={loadingJob === job._id || job.status === "Closed"}
  >
    {loadingJob === job._id ? "Loading..." : job.status === "Closed" ? "Closed" : "Apply Now"}
  </button>
)}

                </div>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No job opportunities available for your department at the moment.</p>
        )}
      </div>

      {/* Modal for Viewing Full Description */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] flex flex-col">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          {/* Scrollable container for the description */}
          <div className="overflow-y-auto flex-1">
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
              {selectedJobDescription}
            </pre>
          </div>
          <button
            onClick={() => setViewModalOpen(false)}
            className="bg-gray-500 text-white px-3 py-1 rounded mt-4 self-end"
          >
            Close
          </button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default JobOpportunities;