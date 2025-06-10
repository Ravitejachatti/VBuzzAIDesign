import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { fetchPlacements,deletePlacement,updatePlacements } from "../../../Redux/PlacementSlice";

const EditDeletePlacement = ({ user, colleges }) => {
  const universityId = user?.id || "";
    const { universityName } = useParams(); 
    const dispatch = useDispatch()
  const {placements,loading} = useSelector(state=>state.placements)


  const [originalForm, setOriginalForm] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    head: "",
    email: "",
    password: "",
    phone: "",
    colleges: [],
    universityId: universityId,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    head: "",
    email: "",
    password: "",
    phone: "",
    colleges: [],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loadingPlacements, setLoadingPlacements] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlacementId, setCurrentPlacementId] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all placement cells
  const fetchAllPlacements = async () => {
    const token = localStorage.getItem("University authToken")
    
     dispatch(fetchPlacements({token,universityName})) 
     
  };

  useEffect(() => {
    fetchAllPlacements();
  }, [universityName]);

const openEditPopup = (placement) => {
  const orig = {
    name: placement.name,
    head: placement.head,
    email: placement.email,
    phone: placement.phone,
          password: placement.password ?? "", // leave out password—you never want to prefill that
   colleges: placement.colleges.map(c => c._id.toString()),
  };
 setOriginalForm(orig);
    setEditForm(orig);                              // <- initialize form with orig, including password
    setCurrentPlacementId(placement._id);
    setIsEditing(true);
};



  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

    // Handle College Change
    const handleCollegeChange = (e) => {
      const selectedColleges = Array.from(e.target.selectedOptions, (option) => option.value);
      setEditForm({ ...editForm, colleges: selectedColleges });
    };

    // checkbox handle

    const handleCollegeCheckboxChange = (collegeId) => {
      const selectedColleges = [...editForm.colleges];
      if (selectedColleges.includes(collegeId)) {
        setEditForm({
          ...editForm,
          colleges: selectedColleges.filter((id) => id !== collegeId),
        });
      } else {
        setEditForm({ ...editForm, colleges: [...selectedColleges, collegeId] });
      }
    };
    



  // Handle form submission for editing placement cells
 // Handle form submission for editing placement cells
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("University authToken");
    const patchData = {};

    Object.keys(editForm).forEach(key => {
      const origVal = originalForm[key];
      const currVal = editForm[key];

      if (key === "password") {
        if (currVal && currVal.trim() !== "") {
          patchData.password = currVal;
        }
        return;
      }

      const changed = Array.isArray(currVal)
        ? JSON.stringify(currVal) !== JSON.stringify(origVal)
        : currVal !== origVal;

      if (changed) patchData[key] = currVal;
    });

    if (Object.keys(patchData).length === 0) {
      setIsEditing(false);
      return;
    }

    dispatch(updatePlacements({ token, id: currentPlacementId, patchData, universityName }));
    setIsEditing(false);
  };






  // Handle deletion of placement cells
  const handleDelete = async (id) => {
    const token=localStorage.getItem("University authToken")
    if (window.confirm("Are you sure you want to delete this placement cell?")) {
      dispatch(deletePlacement({token,id,universityName}))
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Placement cell list */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Placement Cells</h3>
        {loadingPlacements ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {placements?.map((placement) => (
              <li key={placement?._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong>Name: {placement?.name}</strong>
                  <p>Placement Head: {placement?.head}</p>
                  <p>Email: {placement?.email}</p>
                  <p>Phone: {placement?.phone}</p>
                  <p>Colleges: {placement?.colleges.map((college) => college.name).join(", ")}</p> 
                </div>
                <div>
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => openEditPopup(placement)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(placement._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Placement Cell Popup */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Placement Cell</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Placement Cell Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Contact Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>

                {/* <div className="mb-4">
                <label className="block mb-1">Current Password</label>
                <input
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="p-2 border rounded-md w-full"
                />
              </div> */}
              <label className="block text-sm mb-2">Select Colleges</label>
              {/* College checkboxes */}
              {colleges?.map(c => (
                <div key={c._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editForm.colleges.includes(c._id)}
                    onChange={() => handleCollegeCheckboxChange(c._id)}
                    className="mr-2"
                  />
                  <label>{c?.name}</label>
                </div>
              ))}


              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Placement Cell"}
              </button>
            </form>
            <button
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDeletePlacement;
