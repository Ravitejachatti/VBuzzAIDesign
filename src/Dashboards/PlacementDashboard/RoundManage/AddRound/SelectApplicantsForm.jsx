import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";

export default function SelectApplicantsForm({ applicants, jobId, roundNumber, universityName }) {
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const options = applicants.map((student) => ({
    value: student.registeredNumber,
    label: `${student.name} (${student.registeredNumber})`,
    name: student.name,
  }));

  const handleSelect = (selectedOptions) => {
    setSelected(selectedOptions || []);
    const updatedFormData = {};
    (selectedOptions || []).forEach((opt) => {
      updatedFormData[opt.value] = formData[opt.value] || {
        name: opt.name,
        registered_number: opt.value,
        status: "Pending",
        feedback: "",
      };
    });
    setFormData(updatedFormData);
  };

  const handleChange = (regNo, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [regNo]: {
        ...prev[regNo],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      applicants: Object.values(formData),
    };

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/job/jobs/${jobId}/round/${roundNumber}?universityName=${encodeURIComponent(universityName)}`,
        payload
      );
      alert("✅ Applicants submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Submission failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <h2 className="text-lg font-semibold mb-3">📋 Select Applicants</h2>

      <button
        onClick={() => handleSelect(options)}
        className="mb-2 text-sm text-blue-600 underline"
      >
        Select All
      </button>

      <Select
        isMulti
        options={options}
        value={selected}
        onChange={handleSelect}
        closeMenuOnSelect={false}
        className="mb-4"
      />

      {selected.length > 0 && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto border-t pt-4">
          {selected.map((opt) => {
            const data = formData[opt.value];
            return (
              <div key={opt.value} className="border p-3 rounded bg-gray-50">
                <p className="font-medium mb-2">
                  {data.name} ({data.registered_number})
                </p>

                <div className="mb-2">
                  <label className="mr-2 font-medium">Status:</label>
                  <select
                    value={data.status}
                    onChange={(e) => handleChange(opt.value, "status", e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Feedback:</label>
                  <input
                    type="text"
                    value={data.feedback}
                    onChange={(e) => handleChange(opt.value, "feedback", e.target.value)}
                    className="border w-full rounded px-2 py-1"
                    placeholder="Optional remarks"
                  />
                </div>
              </div>
            );
          })}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Applicants"}
          </button>
        </div>
      )}
    </div>
  );
}
