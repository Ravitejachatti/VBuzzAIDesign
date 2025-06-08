import React, { useState ,useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

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
  const [convertedFile, setConvertedFile] = useState(null); // For storing the converted CSV file
  const [collegeId, setCollegeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [programId, setProgramId] = useState("");
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false); // Track upload status
  const [uploadResult, setUploadResult] = useState(null); // Store API response
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [reasons, setReasons] = useState([]);

  const token = localStorage.getItem("University authToken");

  const allowedFileTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileError(null);

      if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
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

      // Convert the first sheet to CSV
      const sheetName = workbook.SheetNames[0];
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);

      // Convert CSV data into a Blob
      const csvFile = new Blob([csvData], { type: "text/csv" });
      setConvertedFile(
        new File([csvFile], `${file.name.split(".")[0]}.csv`, {
          type: "text/csv",
        })
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadFile = convertedFile || file;

    if (!uploadFile) return alert("Please upload a file!");
    if (!universityId || !collegeId || !departmentId || !programId) {
      return alert(
        "Please fill all ID fields (University, College, Department, and Program)."
      );
    }

    setLoading(true); // Show loading message
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("universityId", universityId);
    formData.append("collegeId", collegeId);
    formData.append("departmentId", departmentId);
    formData.append("programId", programId);

    try {
      const response = await axios.post(
        `${BASE_URL}/student/bulk-upload?universityName=${universityName}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResult(response.data);
      setShowModal(true);
      // onUploadSuccess();
      setFile(null);
      setConvertedFile(null);
      setCollegeId("");
      setDepartmentId("");
      setProgramId("");
    } catch (error) {
      console.error("Bulk upload failed:", error);

      // Check if API sent an error response
      if (error.response && error.response.data) {
        setUploadResult(error.response.data); // Store error response
        setReasons(error.response.data.reasons);
        setShowModal(true);
      } else {
        setUploadResult({ error: "Something went wrong. Please try again." });
        setShowModal(true);
      }
    } finally {
      setLoading(false); // Hide loading message
    }
  };
  useEffect(() => {
    if (reasons.length > 0) {
      console.log("Updated reasons:", reasons);
    }
  }, [reasons]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-1 md:p-6 mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Bulk Upload Students (.csv or .xlsx files)
          </h2>
          <p className="pb-5 font-sans text-gray-600">
            Upload the students of a class or department. Ensure your file
            matches the required template columns:
          </p>
          <ul className="flex space-x-6 text-gray-700 mb-4 list-decimal list-inside">
            <li className="mr-4"> Name</li>
            <li className="mr-4"> Registered Number</li>
            <li className="mr-4"> Email</li>
            <li className="mr-4"> Phone</li>
            <li className="mr-4"> Enrollment Year</li>
            <li className="mr-4"> Graduation Year</li>
          </ul>

          <p>
            Click here to see the template:{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/17ZFkjh11ZXTGNftQGNwnd2uuMJ3TVmxdyjkNEiRsUUo/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 rounded shadow-lg transition-all duration-300"
            >
              Template
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* University ID */}
          <div>
            <label className="block mb-2 font-medium text-gray-600">
              University ID
            </label>
            <input
              type="text"
              value={universityId}
              readOnly
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* College Dropdown */}
          <div>
            <label className="block mb-2 font-medium text-gray-600">
              Select College
            </label>
            <select
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

          {/* Department Dropdown */}
          <div>
            <label className="block mb-2 font-medium text-gray-600">
              Select Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a department</option>
              {departments
                .filter((dept) => dept.college === collegeId)
                .map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* program dropdown */}
        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-600">
            Select Program
          </label>
          <select
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-600">
            Upload File
          </label>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
        </div>

        {loading && (
          <p className="text-blue-500 mt-4">Uploading, please wait...</p>
        )}

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow-lg transition-all duration-300"
            disabled={loading}
          >
            Upload File
          </button>
        </div>
      </form>
      
      {showModal && uploadResult && (
        <div className="mt-6 p-4 bg-white border border-gray-300 rounded shadow-md">
          <h2 className="text-lg font-bold mb-2">Upload Result</h2>

          {/* Show Error Message */}
          {uploadResult.error && (
            <p className="text-red-600 font-semibold">
              🚨 {uploadResult.error}
            </p>
          )}

          {/* Success & Failed Counts */}
          {uploadResult.message && (
            <p className="text-gray-700">{uploadResult.message}</p>
          )}
          {uploadResult.successCount !== undefined && (
            <p className="text-green-600 font-semibold">
              ✅ Success: {uploadResult.successCount}
            </p>
          )}
          {uploadResult.failedCount !== undefined && (
            <p className="text-red-600 font-semibold">
              ❌ Failed: {uploadResult.failedCount}
            </p>
          )}

          {/* Failed Records Section */}
          {uploadResult.failedRecords &&
            uploadResult.failedRecords.length > 0 && (
              <div className="mt-4">
                <p className="text-red-500 font-semibold">🚨 Failed Records:</p>
                <div className="max-h-48 overflow-auto border border-gray-200 rounded p-2 bg-gray-50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Registered No</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Enrollment</th>
                        <th className="p-2 border">Graduation</th>
                        <th className="p-2 border">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadResult.failedRecords.map((record, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2 border">
                            {record.row?.name || "N/A"}
                          </td>
                          <td className="p-2 border">
                            {record.row?.registered_number || "N/A"}
                          </td>
                          <td className="p-2 border">
                            {record.row?.email || "N/A"}
                          </td>
                          <td className="p-2 border">
                            {record.row?.phone || "N/A"}
                          </td>
                          <td className="p-2 border">
                            {record.row?.enrollment_year || "N/A"}
                          </td>
                          <td className="p-2 border">
                            {record.row?.graduation_year || "N/A"}
                          </td>
                          <td className="p-2 border text-red-500">
                            {record.error || "Unknown Error"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Display General Errors */}
{reasons.length > 0 && (
  <div className="mt-4">
    <p className="text-red-500 font-semibold">🚨 Error Reasons:</p>
    <div className="max-h-48 overflow-auto border border-gray-200 rounded p-2 bg-gray-50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Registered No</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Enrollment</th>
            <th className="p-2 border">Graduation</th>
            <th className="p-2 border">Error</th>
          </tr>
        </thead>
        <tbody>
          {reasons.map((reason, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{reason.row?.name || "N/A"}</td>
              <td className="p-2 border">{reason.row?.registered_number || "N/A"}</td>
              <td className="p-2 border">{reason.row?.email || "N/A"}</td>
              <td className="p-2 border">{reason.row?.phone || "N/A"}</td>
              <td className="p-2 border">{reason.row?.enrollment_year || "N/A"}</td>
              <td className="p-2 border">{reason.row?.graduation_year || "N/A"}</td>
              <td className="p-2 border text-red-500">{reason.error || "Unknown Error"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
