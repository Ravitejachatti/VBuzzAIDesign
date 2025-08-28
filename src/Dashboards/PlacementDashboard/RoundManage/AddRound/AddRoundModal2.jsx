import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Users,
} from "lucide-react";

const DEFAULT_MESSAGE = "Please join with your credentials.";
const DEFAULT_FEEDBACK = "Invited to this round.";

/**
 * Props:
 * - open, onClose
 * - selectedJobTitle
 * - roundData, setRoundData
 * - applicants: Array<{ _id?, id?, name, registered_number, ... }>
 * - loadingApplicants?: boolean
 * - applicantsError?: string | null
 * - handleAddRound: (selectedApplicantsForPayload) => void | Promise<void>
 */
const AddRoundModal2 = ({
  open,
  onClose,
  selectedJobTitle,
  roundData,
  setRoundData,
  applicants = [],
  loadingApplicants = false,
  applicantsError = null,
  handleAddRound,
}) => {
  if (!open) return null;

  // Normalize applicants to a consistent shape + stable id
  const normalizedApplicants = useMemo(() => {
    const list = (Array.isArray(applicants) ? applicants : []).map((a, idx) => {
      const name =
        a?.name ||
        [a?.firstName, a?.lastName].filter(Boolean).join(" ") ||
        "Unnamed";
      const registered_number =
        a?.registered_number || a?.regNo || a?.registrationNumber || "";
      const id = a?._id || a?.id || registered_number || `row-${idx}`;
      if (!registered_number) {
        // Don’t block UI, but log so backend mappings can be fixed quickly
        console.warn("[AddRoundModal] Applicant missing registered_number:", a);
      }
      return { id, name, registered_number };
    });
    return list;
  }, [applicants]);

  // Selection state
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Reset selection/search when applicants change or modal opens
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedIds(new Set());
  }, [open, applicants]);

  // Filtering
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalizedApplicants;
    return normalizedApplicants.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.registered_number.toLowerCase().includes(q)
    );
  }, [normalizedApplicants, query]);

  // Selection helpers
  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const selectAllVisible = () => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      visible.forEach((a) => s.add(a.id));
      return s;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedCount = selectedIds.size;
  const totalCount = normalizedApplicants.length;

  // Prepare payload and submit
  const onSubmit = async () => {
    try {
      if (!roundData?.name || !roundData?.date || !roundData?.description) {
        alert("Please fill Round Name, Date and Description.");
        return;
      }
      if (selectedIds.size === 0) {
        alert("Please select at least one applicant.");
        return;
      }

      const selectedForPayload = normalizedApplicants
        .filter((a) => selectedIds.has(a.id))
        .map((a) => ({
          registered_number: a.registered_number,
          name: a.name,
          message: DEFAULT_MESSAGE,
          feedback: DEFAULT_FEEDBACK,
        }));

      console.log("[AddRoundModal] Submitting payload:", {
        roundData,
        applicantsCount: selectedForPayload.length,
        sample: selectedForPayload.slice(0, 3),
      });

      await Promise.resolve(handleAddRound(selectedForPayload));
    } catch (err) {
      console.error("[AddRoundModal] handleAddRound error:", err);
      alert("Failed to add round. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
     <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-5xl h-[80vh] sm:h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-bold">Addss Round for {selectedJobTitle}</h2>
              <p className="text-green-100 text-sm">
                Create a new recruitment round & invite applicants
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
     <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">
                  Applicants are loaded from this job’s applications.
                </p>
                <p>
                  Each selected applicant will receive the default{" "}
                  <span className="italic">message</span> and{" "}
                  <span className="italic">feedback</span>.
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  Message: “{DEFAULT_MESSAGE}” — Feedback: “{DEFAULT_FEEDBACK}”
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Technical Interview, HR Round"
                  value={roundData.name}
                  onChange={(e) =>
                    setRoundData({ ...roundData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round Date *
                </label>
                <input
                  type="date"
                  value={roundData.date}
                  onChange={(e) =>
                    setRoundData({ ...roundData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Round Description *
              </label>
              <textarea
                placeholder="Describe the round details, requirements, and instructions..."
                value={roundData.description}
                onChange={(e) =>
                  setRoundData({ ...roundData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/document.pdf"
                  value={roundData.pdfLink}
                  onChange={(e) =>
                    setRoundData({ ...roundData, pdfLink: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/exam-portal"
                  value={roundData.examLink}
                  onChange={(e) =>
                    setRoundData({ ...roundData, examLink: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Applicants multi-select */}
            <div className="border rounded-2xl">
              <div className="px-4 py-3 border-b bg-gray-50 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    Applicants ({totalCount})
                  </span>
                  <span className="text-sm text-gray-500">
                    • Selected: {selectedCount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by name or reg. no."
                      className="pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={selectAllVisible}
                    className="text-xs px-2 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                    disabled={loadingApplicants || visible.length === 0}
                  >
                    Select visible
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    disabled={selectedCount === 0}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-auto divide-y">
                {loadingApplicants ? (
                  <div className="p-4 text-gray-600">Loading applicants…</div>
                ) : applicantsError ? (
                  <div className="p-4 text-red-600">
                    Failed to load applicants: {String(applicantsError)}
                  </div>
                ) : visible.length === 0 ? (
                  <div className="p-4 text-gray-600">No applicants found.</div>
                ) : (
                  visible.map((a) => {
                    const checked = selectedIds.has(a.id);
                    return (
                      <label
                        key={a.id}
                        className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={checked}
                          onChange={() => toggleOne(a.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {a.name || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Reg No: {a.registered_number || "-"}
                          </div>
                        </div>
                        {checked && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-60"
            disabled={loadingApplicants}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoundModal2;
