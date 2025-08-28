// src/Dashboards/Placement/Rounds/AddRoundModal.jsx
import React from "react";
import { X, Upload, Download, AlertCircle, CheckCircle, Plus } from "lucide-react";

const AddRoundModal = ({
    open,
    onClose,
    selectedJobTitle,
    roundData,
    setRoundData,
    handleFileUpload,
    applicants = [],
    handleAddRound,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-xl font-bold">Add Round for {selectedJobTitle}</h2>
                            <p className="text-green-100 text-sm">Create a new recruitment round</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Excel template note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-900 mb-2">Excel Template Requirements</h3>
                                <p className="text-sm text-blue-700 mb-2">Please upload a .xlsx file with the following columns:</p>
                                <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                                    <li><strong>name</strong> – Student's full name</li>
                                    <li><strong>registered_number</strong> – Student's registration number</li>
                                    <li><strong>status</strong> – Application status (optional, defaults to "selected")</li>
                                    <li><strong>feedback</strong> – Feedback for the student (optional)</li>
                                </ul>
                                <div className="mt-3">
                                    <a
                                        href="https://docs.google.com/spreadsheets/d/1UhM-_DS4tNH6UfcHSsDZfsEIhjEkOX-8s1ZQAYQE78o/edit?usp=sharing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        View Sample Template
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Round Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Technical Interview, HR Round"
                                    value={roundData.name}
                                    onChange={(e) => setRoundData({ ...roundData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PDF Link</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/document.pdf"
                                    value={roundData.pdfLink}
                                    onChange={(e) => setRoundData({ ...roundData, pdfLink: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Round Date *</label>
                                <input
                                    type="date"
                                    value={roundData.date}
                                    onChange={(e) => setRoundData({ ...roundData, date: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Round Description *</label>
                            <textarea
                                placeholder="Describe the round details, requirements, and instructions..."
                                value={roundData.description}
                                onChange={(e) => setRoundData({ ...roundData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Link</label>
                            <input
                                type="url"
                                placeholder="https://example.com/exam-portal"
                                value={roundData.examLink}
                                onChange={(e) => setRoundData({ ...roundData, examLink: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        {/* Excel upload (kept) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="w-4 h-4 inline mr-1" />
                                Upload Applicants (Excel File)
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.csv"
                                onChange={handleFileUpload}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            {applicants.length > 0 && (
                                <p className="mt-2 text-sm text-green-600 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {applicants.length} applicants loaded
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleAddRound} className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Round
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoundModal;
