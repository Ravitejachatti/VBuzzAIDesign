import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppliedJobs,
  fetchShortlistedRounds,
  fetchSelectedJobs
} from "../../../Redux/StudentDashboard/jobSlice";
import {
  Target, Search, Users, Calendar, Briefcase, Building2
} from 'lucide-react';

const JobRound = () => {
  const universityName = localStorage.getItem("universityName") || "defaultUniversity";
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("applied");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    appliedJobs,
    shortlistedRounds,
    selectedJobs,
    loading,
    error
  } = useSelector((state) => state.job);

  const handleTabChange = (tab) => setActiveTab(tab);

 useEffect(() => {
   dispatch(fetchAppliedJobs({ universityName }));
   dispatch(fetchShortlistedRounds({ universityName }));
   dispatch(fetchSelectedJobs({ universityName }));
 }, [dispatch, universityName]);

  const getCount = (tab) => {
    if (tab === "applied") return appliedJobs.length;
    if (tab === "shortlisted") return shortlistedRounds.length;
    if (tab === "selected") return selectedJobs.length;
    return 0;
  };

  let dataSource = [];
  if (activeTab === "applied") dataSource = appliedJobs;
  else if (activeTab === "shortlisted") dataSource = shortlistedRounds;
  else if (activeTab === "selected") dataSource = selectedJobs;

  const filteredData = dataSource.filter((item) => {
    const title = item.jobTitle || item.title || "";
    const company = item.company || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderStatusBadge = (status) => {

    switch (status?.toLowerCase()) {
      case "selected":
      case "qualified":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Selected</span>;
      case "in progress":
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">In Progress</span>;
      case "not proceeded":
        console.log("Not Proceeded status detected");
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Not Proceeded</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Pending</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Interview Round Tracker
        </h2>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-4 py-1.5 rounded-full shadow">
          {filteredData.length} Records
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b pb-2">
        {["applied", "shortlisted", "selected"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`relative px-4 py-2 rounded-t-lg font-medium focus:outline-none transition ${
              activeTab === tab
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={`ml-1 inline-block text-xs px-2 py-0.5 rounded-full ${
              activeTab === tab
                ? "bg-white text-blue-600"
                : "bg-gray-300 text-gray-800"
            }`}>
              {getCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
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

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No Records Found</h3>
          <p className="text-sm text-gray-500">Try another tab or refine your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200 p-4 space-y-2"
            >
              <div className="space-y-1">
                
                <h4 className="text-base font-semibold truncate"> 
                  <Building2 className="inline w-4 h-4 mr-1 text-gray-400" />
                  {index + 1}. {item.company}</h4>
                <p className="text-sm text-gray-500 truncate">
                  <Briefcase className="inline w-4 h-4 mr-1 text-gray-400" />
                  {item.jobTitle || item.title}</p>
                {/* <p className="text-xs text-gray-400">#{index + 1}</p> */}
                <br />
              </div>

              {activeTab === "shortlisted" ? (
                <div className="space-y-1 text-sm mt-2">
                  <p><strong>Latest Round:</strong> {item.latestRoundName}</p>
                  <p><strong>Status:</strong> {renderStatusBadge(item.latestRoundStatus)}</p>
                  {item.previousRounds && item.previousRounds.length > 0 && (
                    <p className="text-xs text-gray-500 leading-snug">
                      Previous: {item.previousRounds.join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1 text-sm mt-2">
                  <p><Users className="inline w-4 h-4 mr-1 text-gray-400" /> Min. {item.minPercentage || '-'}% required</p>
                  <p><Calendar className="inline w-4 h-4 mr-1 text-gray-400" /> Closing: {item.closingDate ? new Date(item.closingDate).toLocaleDateString() : '-'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 text-sm font-medium">{error}</div>
      )}
    </div>
  );
};

export default JobRound;