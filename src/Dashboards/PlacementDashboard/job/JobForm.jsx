import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch,useSelector } from "react-redux"; 
import { addjob } from "../../../Redux/Jobslice";


const JobForm = ({ onJobAdded, colleges, programs }) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");
  const dispatch=useDispatch() 
  const {jobs,loading} = useSelector(state=>state.jobs)
  const [formData, setFormData] = useState({
    passingYear: "",
    colleges: [],
    departments: [],
    programs: [],
    title: "",
    company: "",
    ctc: "",
    role: "",
    type: "",
    location: "",
    description: "",
    minPercentage: "",
    linkToApply: "",
    linkToPdf: "",
    closingDate: new Date(),
  });

  const [showPreview, setShowPreview] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ colleges: false, departments: false, programs: false });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
        alert("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, [universityName]);

  useEffect(() => {
    const filtered = programs.filter((program) =>
      formData.departments.includes(program.department)
    );
    setFilteredPrograms(filtered);
  }, [formData.departments, programs]);

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelectAll = (key, items) => {
    const allSelected = formData[key].length === items.length;
    const newSelection = allSelected ? [] : items.map((item) => item._id);
    setFormData({ ...formData, [key]: newSelection });
  };

  const handleSelectionChange = (id, key) => {
    const updatedList = formData[key].includes(id)
      ? formData[key].filter((item) => item !== id)
      : [...formData[key], id];
    setFormData({ ...formData, [key]: updatedList });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePreview = () => {
    setShowPreview(!showPreview);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(addjob({token,formData,universityName}))
      
      onJobAdded();
      alert("Job added successfully!", "success");  
      setFormData({
        title: "",
        company: "",
        ctc: "",
        role: "",
        type: "",
        location: "",
        description: "",
        colleges: [],
        departments: [],
        programs: [],
        passingYear: "",
        minPercentage: "",
        linkToApply: "",
        linkToPdf: "",
        closingDate: new Date(),
      });
      setShowPreview(false);
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Error adding job. Please try again.");
    }
  };

  return (
    <div className="mx-auto p-2  bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Add job</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-2">

        {/* College, Department, Program */}
        <div className="grid grid-cols-3 gap-5">
            {/* Job Type */}
          <div>
            <label className="block font-semibold text-gray-700">Job Type(Internship/Full Time)</label>
            <input
              type="text"
              placeholder="Job Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>
          {["colleges", "departments", "programs"].map((key) => (
            <div key={key} className="relative">
              <label className="block font-semibold text-gray-700 capitalize mb-1">{key}</label>
              <div onClick={() => toggleDropdown(key)} className="p-2 border rounded bg-white cursor-pointer">
                {formData[key].length ? `${formData[key].length} selected` : `Select ${key}`}
              </div>
              {dropdownOpen[key] && (
                <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                  <label className="flex items-center p-2 bg-gray-100">
                    <input type="checkbox" onChange={() => toggleSelectAll(key, key === "colleges" ? colleges : key === "departments" ? departments : filteredPrograms)} />
                    Select All
                  </label>
                  {(key === "colleges" ? colleges : key === "departments" ? departments : filteredPrograms).map((item) => (
                    <label key={item._id} className="flex items-center p-2 hover:bg-gray-100">
                      <input type="checkbox" checked={formData[key].includes(item._id)} onChange={() => handleSelectionChange(item._id, key)} />
                      {item.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div>
            <label className="block font-semibold text-gray-700">Passing Years</label>
            <input placeholder="Passing Year" name="passingYear" type="number" value={formData.passingYear} onChange={handleChange} className="p-2 w-full border rounded" required />
          </div>

          {/* Company */}
          <div>
            <label className="block font-semibold text-gray-700">Company</label>
            <input
              type="text"
              placeholder="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="p-2 w-full border rounded"
              required
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block font-semibold text-gray-700">Job Title</label>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="p-2 w-full border rounded"
              required
            />
          </div>

          {/* Role */}
          <div className="col-span-2">
            <label className="block font-semibold text-gray-700">Role</label>
            <textarea
              type="text"
              placeholder="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>
          <div className="col-span-3">
          <label className="block font-semibold text-gray-700">Descriptions</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="p-2 w-full border rounded" rows="" ></textarea>
        </div>


          {/* Location */}
          <div>
            <label className="block font-semibold text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>

          {/* CTC */}
          <div>
            <label className="block font-semibold text-gray-700">CTC (LPA)</label>
            <input
              type="text"
              placeholder="CTC"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              className="p-2 w-full border rounded"
              required
            />
          </div>

          {/* Minimum Percentage */}
          <div>
            <label className="block font-semibold text-gray-700">Minimum Percentage</label>
            <input
              type="number"
              placeholder="Min Percentage"
              name="minPercentage"
              value={formData.minPercentage}
              onChange={handleChange}
              className="p-2 w-full border rounded"

            />
          </div>

          {/* Link to Apply */}
          <div>
            <label className="block font-semibold text-gray-700">Link to Apply(optional)</label>
            <input
              type="url"
              placeholder="Link to Apply"
              name="linkToApply"
              value={formData.linkToApply}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>

          {/* Link to PDF */}
          <div>
            <label className="block font-semibold text-gray-700">Link to PDF(optional)</label>
            <input
              type="url"
              placeholder="Link to PDF"
              name="linkToPdf"
              value={formData.linkToPdf}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>


          {/* Description */}


          {/* Closing Date */}
          <div>
            <label className="block font-semibold text-gray-700">Closing Date</label>
            <DatePicker selected={formData.closingDate} onChange={(date) => setFormData({ ...formData, closingDate: date })} className="p-2 w-full border rounded" />
          </div>


        </div>
       
        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <button type="button" onClick={handlePreview} className="bg-gray-500 text-white px-4 py-2 rounded">Preview</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Job</button>
        </div>
      </form>

      {/* preview of the form */}
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Job Preview</h3>
            <div className="space-y-2">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Company:</strong> {formData.company}</p>
              <p><strong>CTC:</strong> {formData.ctc} LPA</p>
              <p><strong>Role:</strong> {formData.role}</p>
              <p><strong>Type:</strong> {formData.type}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Min Percentage:</strong> {formData.minPercentage}%</p>
              <p><strong>Link to Apply:</strong> {formData.linkToApply}</p>
              <p><strong>Link to PDF:</strong> {formData.linkToPdf}</p>
              <p><strong>Closing Date:</strong> {formData.closingDate.toLocaleDateString()}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Passing Year:</strong> {formData.passingYear}</p>

              {/* College, Department, Program Preview */}
              <p><strong>Colleges:</strong> {colleges.filter(college => formData.colleges.includes(college._id)).map(college => college.name).join(", ")}</p>
              <p><strong>Departments:</strong> {departments.filter(dept => formData.departments.includes(dept._id)).map(dept => dept.name).join(", ")}</p>
              <p><strong>Programs:</strong> {filteredPrograms.filter(prog => formData.programs.includes(prog._id)).map(prog => prog.name).join(", ")}</p>
            </div>
            <div className="mt-4 text-right">
              <button onClick={handlePreview} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close Preview</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobForm;


