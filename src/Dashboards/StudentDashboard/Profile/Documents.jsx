import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const UpdateDocuments = ({ goToNext }) => {
  const { id } = useParams(); // Get student ID from the URL
  const [documents, setDocuments] = useState({
    transcripts: [],
    resumeOrCV: "",
    personalStatement: "",
    coverLetter: "",
    lettersOfRecommendation: [],
    offerLetters: [],
    testScores: [{ testName: "", score: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const location = useLocation();

  // Retrieve studentData from location.state or localStorage
  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  // Fetch existing documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const studentData = response.data.student;
        setDocuments({
          transcripts: studentData.documents?.transcripts || [],
          resumeOrCV: studentData.documents?.resumeOrCV || "",
          personalStatement: studentData.documents?.personalStatement || "",
          coverLetter: studentData.documents?.coverLetter || "",
          lettersOfRecommendation: studentData.documents?.lettersOfRecommendation || [],
          offerLetters: studentData.documents?.offerLetters || [],
          testScores: studentData.documents?.testScores || [{ testName: "", score: "" }],
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        setMessage("Failed to fetch documents.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [studentId, universityName, token]);

  // Handle form field changes
  const handleChange = (e, field, index = null, subField = null) => {
    const { value } = e.target;
    if (index !== null && subField !== null) {
      // Handle nested fields (e.g., testScores)
      const updatedArray = [...documents[field]];
      updatedArray[index][subField] = value;
      setDocuments((prev) => ({
        ...prev,
        [field]: updatedArray,
      }));
    } else if (index !== null) {
      // Handle array fields (e.g., transcripts, lettersOfRecommendation)
      const updatedArray = [...documents[field]];
      updatedArray[index] = value;
      setDocuments((prev) => ({
        ...prev,
        [field]: updatedArray,
      }));
    } else {
      // Handle non-array fields
      setDocuments((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Add a new entry to an array field
  const addEntry = (field, defaultValue = "") => {
    setDocuments((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  // Remove an entry from an array field
  const removeEntry = (field, index) => {
    const updatedArray = documents[field].filter((_, i) => i !== index);
    setDocuments((prev) => ({
      ...prev,
      [field]: updatedArray,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-documents?universityName=${encodeURIComponent(universityName)}`,
        { documents },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Documents updated successfully!");
      if (goToNext) goToNext(); // 👉 Move to the next section
    } catch (error) {
      console.error("Failed to update documents:", error);
      setMessage("Failed to update documents.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="md:p-6">
  <h1 className="text-2xl font-semibold mb-4 text-gray-800">Update Documents</h1>
  <p className="text-red-700 font-sans text-sx">Note: Give the drive sharable link of your document only.</p>

  {message && (
    <p
      className={`mb-4 p-3 rounded-md text-sm ${
        message.includes("success")
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {message}
    </p>
  )}

  <form onSubmit={handleSubmit} className="space-y-2">

      {/* Single Input Fields in Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t">
      {/* Resume */}
  
      <div className="">
        <label className="block text-lg font-bold text-gray-700 my-1">1.Resume</label>
        <p className="text-sm text-gray-500">You can upload resume build here or by yourself on any other platform as well.</p>
        <input
          type="text"
          value={documents.resumeOrCV}
          onChange={(e) => handleChange(e, "resumeOrCV")}
          placeholder="Resume URL"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Personal Statement */}
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-1">2.Statement of Purpose(optional)</label>
        <input
          type="text"
          value={documents.personalStatement}
          onChange={(e) => handleChange(e, "personalStatement")}
          placeholder="Personal Statement URL"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cover Letter */}
      <div>
        <label className="block text-lg font-bold text-gray-700 mb-1">3.Cover Letter(optional)</label>
        <input
          type="text"
          value={documents.coverLetter}
          onChange={(e) => handleChange(e, "coverLetter")}
          placeholder="Cover Letter URL"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    {/* Section: Transcripts */}
    <div>
      <h2 className="border-t text-lg font-semibold text-gray-700 mb-1">4.Transcripts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 gap-2">
        {documents.transcripts.map((transcript, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Transcript URL"
              value={transcript}
              onChange={(e) => handleChange(e, "transcripts", index)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeEntry("transcripts", index)}
              className="text-gray-600 hover:text-red-800 font-semibold border px-2 py-1 rounded-md"
            >
            X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => addEntry("transcripts", "")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium border px-4 py-2 rounded-md"
        >
          + Add Transcript
        </button>
      </div>
    </div>

    {/* Letters of Recommendation */}
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-1 border-t">5.Letters of Recommendation</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.lettersOfRecommendation.map((letter, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={letter}
              onChange={(e) => handleChange(e, "lettersOfRecommendation", index)}
              placeholder="Letter URL"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeEntry("lettersOfRecommendation", index)}
              className="text-gray-600 hover:text-red-800 font-bold border px-2 py-1 rounded-md"
            >
                X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => addEntry("lettersOfRecommendation", "")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium border px-4 py-2 rounded-md"
        >
          + Add Letter
        </button>
      </div>
    </div>

    {/* Offer Letters */}
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-1 border-t">6.Offer Letters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.offerLetters.map((offer, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={offer}
              onChange={(e) => handleChange(e, "offerLetters", index)}
              placeholder="Offer Letter URL"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeEntry("offerLetters", index)}
              className="text-gray-600 hover:text-red-800 font-bold border px-2 py-1 rounded-md"
            >
            X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => addEntry("offerLetters", "")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium border px-4 py-2 rounded-md"
        >
          + Add Offer Letter
        </button>
      </div>
    </div>

    {/* Test Scores */}
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3 border-t">7.Test Scores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.testScores.map((test, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 items-center">
            <input
              type="text"
              placeholder="Test Name"
              value={test.testName}
              onChange={(e) => handleChange(e, "testScores", index, "testName")}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Score"
              value={test.score}
              onChange={(e) => handleChange(e, "testScores", index, "score")}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => removeEntry("testScores", index)}
                className="text-gray-600 hover:text-red-800 text-sm border px-2 py-1 rounded-md"
              >
             X
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 ">
        <button
          type="button"
          onClick={() => addEntry("testScores", { testName: "", score: "" })}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium border px-4 py-2 rounded-md"
        >
          + Add Test Score
        </button>
      </div>
    </div>

    {/* Submit */}
    <div className="flex flex-col items-center pt-6 border-t">
  <p className="mb-3 text-sm text-gray-700 font-medium text-center">
    📌 Please review all input fields carefully before clicking <span className="font-semibold text-green-700">Update & Next</span>.
  </p>
  <button
    type="submit"
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-sm font-medium"
  >
    Update & Next
  </button>
</div>

  </form>
</div>

  );
};

export default UpdateDocuments;