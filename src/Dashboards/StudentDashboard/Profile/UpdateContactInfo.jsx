import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const UpdateContactInfo = ({ goToNext }) => {
  const { id } = useParams();
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const location = useLocation();

  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  useEffect(() => {
    const fetchContactInfo = async () => {
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
        setContactInfo({
          phone: studentData.contactInfo?.phone || "",
          email: studentData.contactInfo?.email || "",
          address: {
            street: studentData.contactInfo?.address?.street || "",
            city: studentData.contactInfo?.address?.city || "",
            state: studentData.contactInfo?.address?.state || "",
            postalCode: studentData.contactInfo?.address?.postalCode || "",
            country: studentData.contactInfo?.address?.country || "India",
          },
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
        setMessage("Failed to fetch contact info.");
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [studentId, universityName, token]);

  const handleChange = (e, field, nestedField = null) => {
    const { value } = e.target;
    if (nestedField) {
      setContactInfo((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: value,
        },
      }));
    } else {
      setContactInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-contact?universityName=${encodeURIComponent(universityName)}`,
        { contactInfo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Contact info updated successfully!");
      if (goToNext) goToNext();  // 👈 Navigate to next section
    } catch (error) {
      console.error("Failed to update contact info:", error);
      setMessage("Failed to update contact info.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" mx-auto md:p-2">
      <div className="md:p-6">
        <h1 className=" text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-6">Update Contact Information:</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Phone Number</label>
              <input
                type="text"
                placeholder="Phone number"
                value={contactInfo.phone}
                onChange={(e) => handleChange(e, "phone")}
                className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Email</label>
              <input
                type="email"
                placeholder="Email address"
                value={contactInfo.email}
                onChange={(e) => handleChange(e, "email")}
                className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={contactInfo.address.street}
                  onChange={(e) => handleChange(e, "address", "street")}
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={contactInfo.address.city}
                  onChange={(e) => handleChange(e, "address", "city")}
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={contactInfo.address.state}
                  onChange={(e) => handleChange(e, "address", "state")}
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="Postal code"
                  value={contactInfo.address.postalCode}
                  onChange={(e) => handleChange(e, "address", "postalCode")}
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={contactInfo.address.country}
                  onChange={(e) => handleChange(e, "address", "country")}
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

         <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Update and next
            </button>
          </div>
        </form>

       
      </div>
    </div>
  );
};

export default UpdateContactInfo;