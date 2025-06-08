import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Upload, FileText, AlertCircle, CheckCircle, Download, Users } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BulkUpload = ({
  universityId,
  colleges,
  departments,
  programs,
  onUploadSuccess,
}) => {
  const { universityName } = useParams();
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [formData, setFormData] = useState({
    collegeId: "",
    departmentId: "",
    programId: "",
  });
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const token = localStorage.getItem("University authToken");

  const allowedFileTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const requiredColumns = [
    "Name",
    "Registered Number", 
    "Email",
    "Phone",
    "Enrollment Year",
    "Graduation Year"
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileError(null);

      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        convertToCSV(selectedFile);
      } else {
        setConvertedFile(null);
      }
    } else {
      setFile(null);
      setConvertedFile(null);
      setFileError("Invalid file type. Only .csv and .xlsx files are allowed.");
    }
  };

  const convertToCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

      const csvFile = new Blob([csvData], { type: "text/csv" });
      setConvertedFile(
        new File([csvFile], `${file.name.split(".")[0]}.csv`, {
          type: "text/csv",
        })
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadTemplate = () => {
    const templateData = [requiredColumns];
    const sampleData = [
      "John Doe",
      "REG001",
      "john.doe@example.com", 
      "9876543210",
      "2020",
      "2024"
    ];
    templateData.push(sampleData);

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Template");
    XLSX.writeFile(workbook, "student_upload_template.xlsx");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadFile = convertedFile || file;

    if (!uploadFile) {
      alert("Please upload a file!");
      return;
    }
    
    if (!universityId || !formData.collegeId || !formData.departmentId || !formData.programId) {
      alert("Please fill all required fields (University, College, Department, and Program).");
      return;
    }

    setLoading(true);
    setUploadResult(null);

    const submitData = new FormData();
    submitData.append("file", uploadFile);
    submitData.append("universityId", universityId);
    submitData.append("collegeId", formData.collegeId);
    submitData.append("departmentId", formData.departmentId);
    submitData.append("programId", formData.programId);

    try {
      const response = await axios.post(
        `${BASE_URL}/student/bulk-upload?universityName=${universityName}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResult(response.data);
      setShowModal(true);
      setFile(null);
      setConvertedFile(null);
      setFormData({
        collegeId: "",
        departmentId: "",
        programId: "",
      });
    } catch (error) {
      console.error("Bulk upload failed:", error);

      if (error.response && error.response.data) {
        setUploadResult(error.response.data);
        setReasons(error.response.data.reasons || []);
        setShowModal(true);
      } else {
        setUploadResult({ error: "Something went wrong. Please try again." });
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reasons.length > 0) {
      console.log("Updated reasons:", reasons);
    }
  }, [reasons]);

  const filteredDepartments = departments.filter(dept => dept.college === formData.collegeId);
  const filteredPrograms = programs.filter(prog => prog.department === formData.departmentId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bulk Upload Students</h2>
              <p className="text-sm text-gray-600">
                Upload multiple students at once using CSV or Excel files
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Template Download Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Download Template</h3>
                <p className="text-blue-700 mb-3">
                  Use our template to ensure proper formatting. The template includes all required columns:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {requiredColumns.map((column, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {column}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* University ID - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University ID
              </label>
              <input
                type="text"
                value={universityId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Selection Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* College Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select College *
                </label>
                <select
                  name="collegeId"
                  value={formData.collegeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a college</option>
                  {colleges.map((college) => (
                    <option key={college._id} value={college._id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department *
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  disabled={!formData.collegeId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  required
                >
                  <option value="">Select a department</option>
                  {filteredDepartments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Program *
                </label>
                <select
                  name="programId"
                  value={formData.programId}
                  onChange={handleInputChange}
                  disabled={!formData.departmentId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  required
                >
                  <option value="">Select a program</option>
                  {filteredPrograms.map((program) => (
                    <option key={program._id} value={program._id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : file 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-green-600 mb-3" />
                    <p className="font-medium text-green-900 mb-1">{file.name}</p>
                    <p className="text-sm text-green-700">
                      File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setConvertedFile(null);
                        setFileError(null);
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      Drop your file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Supports CSV and Excel (.xlsx) files up to 10MB
                    </p>
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      <input 
                        type="file" 
                        accept=".csv,.xlsx" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                      Select File
                    </label>
                  </div>
                )}
              </div>
              {fileError && (
                <div className="mt-2 flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{fileError}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !file}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Upload Students
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && uploadResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upload Results</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {uploadResult.successCount !== undefined && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">Successful</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {uploadResult.successCount}
                    </p>
                  </div>
                )}
                
                {uploadResult.failedCount !== undefined && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium text-red-900">Failed</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      {uploadResult.failedCount}
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {uploadResult.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium text-red-900">Error</span>
                  </div>
                  <p className="text-red-800 mt-1">{uploadResult.error}</p>
                </div>
              )}

              {/* Failed Records Table */}
              {(uploadResult.failedRecords?.length > 0 || reasons.length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-3">Failed Records</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-red-200">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Name</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Reg. No</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Email</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-200">
                        {(uploadResult.failedRecords || reasons).map((record, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-sm text-red-800">
                              {record.row?.name || "N/A"}
                            </td>
                            <td className="px-3 py-2 text-sm text-red-800">
                              {record.row?.registered_number || "N/A"}
                            </td>
                            <td className="px-3 py-2 text-sm text-red-800">
                              {record.row?.email || "N/A"}
                            </td>
                            <td className="px-3 py-2 text-sm text-red-800">
                              {record.error || "Unknown Error"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;