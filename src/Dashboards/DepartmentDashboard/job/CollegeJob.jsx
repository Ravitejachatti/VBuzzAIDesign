import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../../Redux/Jobslice";
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Eye,
  Filter,
  Search,
  X,
  Clock,
} from "lucide-react";

const JobManager = () => {
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");

  const dispatch = useDispatch();
  const { jobs = [], loading } = useSelector((state) => state.jobs);

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ year: false, type: false });

  // View-only modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalJob, setModalJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs({ token, universityName }));
  }, [dispatch, token, universityName]);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const uniqueYears = jobs.length ? [...new Set(jobs.map((j) => j.passingYear))] : [];
  const uniqueTypes = jobs.length ? [...new Set(jobs.map((j) => j.type))] : [];

  const isJobExpired = (closingDate) => new Date(closingDate) < new Date();

  // Filtering
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchYear = selectedYears.length === 0 || selectedYears.includes(job.passingYear);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(job.type);

      return matchesSearch && matchYear && matchType;
    });
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedYears, selectedTypes]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Listings</h1>
            <p className="text-blue-100 text-lg">Browse all job postings</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredJobs.length}</div>
            <div className="text-blue-200 text-sm">Total Jobs</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Year & Type dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Passing Year",
              options: uniqueYears,
              selected: selectedYears,
              onChange: setSelectedYears,
              key: "year",
              Icon: Calendar,
            },
            {
              label: "Job Type",
              options: uniqueTypes,
              selected: selectedTypes,
              onChange: setSelectedTypes,
              key: "type",
              Icon: Briefcase,
            },
          ].map(({ label, options, selected, onChange, key, Icon }) => (
            <div key={key} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon className="w-4 h-4 inline mr-1" />
                {label}
              </label>
              <div
                onClick={() => setDropdownOpen((p) => ({ ...p, [key]: !p[key] }))}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
              >
                {selected.length ? `${selected.length} selected` : `Select ${label}`}
              </div>
              {dropdownOpen[key] && (
                <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto mt-1">
                  <label className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b">
                    <input
                      type="checkbox"
                      checked={selected.length === options.length && options.length > 0}
                      onChange={() => {
                        if (selected.length === options.length) onChange([]);
                        else onChange([...options]);
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium">Select All</span>
                  </label>
                  {options.map((opt) => (
                    <label key={opt} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={() => {
                          if (selected.includes(opt)) onChange(selected.filter((v) => v !== opt));
                          else onChange([...selected, opt]);
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Jobs Grid (READ-ONLY) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">Loading jobs…</div>
        ) : filteredJobs.length ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location || "Not specified"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {isJobExpired(job.closingDate) && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium">{job.ctc} LPA</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-orange-600" />
                    <span>{job.applications?.length || 0} applicants</span>
                  </div>
                </div>
              </div>

              {/* Only a View button (optional) */}
              <div className="p-4 bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    setModalJob(job);
                    setViewModalOpen(true);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">View</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}
      </div>

      {/* View Modal (read-only) */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <Dialog.Title className="text-2xl font-bold">{modalJob?.title}</Dialog.Title>
                  <p className="text-blue-100">{modalJob?.company}</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {modalJob?.description || "No description available"}
                  </p>
                </div>

                {modalJob?.role && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Role Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{modalJob.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default JobManager;