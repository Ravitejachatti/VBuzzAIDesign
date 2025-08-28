import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedApplicants, resetSelectedApplicantsState, selectAddSelectedApplicantsStatus, selectAddSelectedApplicantsError } from "../../../Redux/Placement/addSelectedApplicants";
import { Search, X } from "lucide-react";

/**
* Modern modal — shows Name + Registration No., but submits ONLY registration numbers.
* Props:
* - open, onClose
* - baseUrl, universityName, jobId, token
* - students: array of { name, registered_number } (extra fields ignored)
*/
export default function AddSelectedApplicantsModal({ open, onClose, BASE_URL, universityName, jobId, token, students = [] }) {
const dispatch = useDispatch();
const status = useSelector(selectAddSelectedApplicantsStatus);
const error = useSelector(selectAddSelectedApplicantsError);


const [query, setQuery] = useState("");
const [selectedRegs, setSelectedRegs] = useState(new Set());
const [manualReg, setManualReg] = useState("");


useEffect(() => {
if (!open) {
setQuery("");
setSelectedRegs(new Set());
setManualReg("");
dispatch(resetSelectedApplicantsState());
}
}, [open, dispatch]);

// normalize/guard against slightly different field names
const normalized = useMemo(() => {
return (students || [])
.map((s) => ({
id: s._id || s.id,
name: s.name || s.fullName || s.studentName || "Unnamed",
reg: s.registered_number || s.registeredNumber || s.registrationNumber || s.regNo || s.reg || "",
}))
.filter((s) => !!s.reg);
}, [students]);


const filtered = useMemo(() => {
if (!query) return normalized;
const q = query.toLowerCase();
return normalized.filter((s) => s.name.toLowerCase().includes(q) || String(s.reg).toLowerCase().includes(q));
}, [normalized, query]);


const toggle = (reg) => {
const next = new Set(selectedRegs);
next.has(reg) ? next.delete(reg) : next.add(reg);
setSelectedRegs(next);
};


const addManual = () => {
const clean = manualReg.trim();
if (!clean) return;
const next = new Set(selectedRegs);
next.add(clean);
setSelectedRegs(next);
setManualReg("");
};

const handleSubmit = async () => {
if (!jobId || selectedRegs.size === 0) return;
const registeredNumbers = Array.from(selectedRegs);
await dispatch(addSelectedApplicants({ BASE_URL, universityName, jobId, registeredNumbers, token }));
};


const closeIfDone = () => { if (status === "succeeded") onClose?.(); };

return (
<Dialog open={open} onClose={onClose} className="relative z-50">
<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
<div className="fixed inset-0 flex items-center justify-center p-4">
<Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
{/* Header */}
<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
<div>
<Dialog.Title className="text-xl font-semibold">Add Selected Applicants</Dialog.Title>
<p className="text-xs text-gray-500">Job ID: <span className="font-mono">{jobId || "—"}</span> · Only registration numbers are submitted.</p>
</div>
<button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
</div>


{/* Body */}
<div className="p-6 space-y-5">
{/* Search */}
<div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
<input
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Search students by name or registration number"
className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
</div>


{/* Student list */}
<div className="border rounded-xl max-h-80 overflow-auto">
{filtered.length === 0 ? (
<div className="p-6 text-sm text-gray-500">No students found. You can add a registration number manually below.</div>
) : (
<ul className="divide-y">
{filtered.map((s) => (
<li key={`${s.reg}`} className="flex items-center justify-between p-3 hover:bg-gray-50">
<div className="min-w-0">
<div className="font-medium text-gray-900 truncate">{s.name}</div>
<div className="text-xs text-gray-500 font-mono">{s.reg}</div>
</div>
<input
type="checkbox"
className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
checked={selectedRegs.has(s.reg)}
onChange={() => toggle(s.reg)}
/>
</li>
))}
</ul>
)}
</div>
{/* Manual add */}
<div className="flex items-center gap-2">
<input
value={manualReg}
onChange={(e) => setManualReg(e.target.value)}
placeholder="Add registration number manually"
className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
<button onClick={addManual} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">Add</button>
</div>


{error && <div className="text-sm text-red-600">❌ {error}</div>}
{status === "succeeded" && <div className="text-sm text-green-700">✅ Applicants added successfully.</div>}
</div>


{/* Footer */}
<div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
<button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-white">Cancel</button>
<button
onClick={async () => { await handleSubmit(); closeIfDone(); }}
disabled={status === "loading" || selectedRegs.size === 0}
className={`px-5 py-2 rounded-lg text-white ${selectedRegs.size === 0 || status === "loading" ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
>
{status === "loading" ? "Adding…" : `Add ${selectedRegs.size || ""}`}
</button>
</div>
</Dialog.Panel>
</div>
</Dialog>
);
}