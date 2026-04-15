import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const CompanyProfile = () => {
  const [file, setFile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("api/company/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        setProfileData(response.data);
        if (response.data.companyData) {
          setFormData({
            name: response?.data?.companyData?.company?.name || "",
            location: response?.data?.companyData?.company?.location || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({
          text: "Failed to load profile data. Please refresh the page.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: "", type: "" });

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("location", formData.location);

      if (file) {
        dataToSend.append("logo", file);
      }

      const response = await api.post("/api/company/profile", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setProfileData(response.data);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setIsModalOpen(false);
      }

      setFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = () => {
    // Reset form data with current profile values
    if (profileData && profileData.companyData) {
      setFormData({
        name: profileData?.companyData?.company?.name || "",
        location: profileData?.companyData?.company?.location || "",
      });
    }
    setFile(null);
    setIsModalOpen(true);
    setMessage({ text: "", type: "" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage({ text: "", type: "" });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="select-none mt-8">
      {/* Alert/Message Box */}
      {message.text && (
        <div
          className={`p-4 mt-4 ${
            message.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <div
        className="bg-white lg:h-167.5 h-195
          dark:bg-gray-800 p-4 shadow-md lg:p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Company Profile
          </h1>
          {profileData.companyData.company == null && (
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {profileData && profileData.companyData ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Company Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Company Name
                  </p>
                  <p className="text-lg text-gray-800 dark:text-white">
                    {profileData?.companyData?.company?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-lg text-gray-800 dark:text-white">
                    {profileData?.companyData?.company?.location ||
                      "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative left-0 ">
              <h2 className=" text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Company Logo
              </h2>
              <div className="flex h-22  rounded overflow-hidden ">
                {profileData?.companyData?.company?.logo ? (
                  <img
                    src={`http://localhost:8000/uploads/${profileData?.companyData?.company?.logo}`}
                    alt="Company Logo"
                    className="max-h-full rounded-2xl  max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No logo uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No company profile data available.
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Owner
              </p>
              <p className="text-lg text-gray-800 dark:text-white">
                {profileData?.companyData?.firstName}{" "}
                {profileData?.companyData?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-lg text-gray-800 dark:text-white">
                {profileData?.companyData?.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Type
              </p>
              <p className="text-lg text-gray-800 dark:text-white capitalize">
                {profileData?.companyData?.accountType}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p
                className={`text-lg  ${profileData?.companyData?.status === "accepted" ? "text-green-800 dark:text-green-600" : "text-red-400 dark:text-red-600"}  capitalize`}
              >
                {profileData?.companyData?.status}
              </p>
              {profileData?.companyData?.status === "pending" &&
                new Date(profileData?.companyData?.updatedAt).getMonth() < //one month delay send email admin
                  new Date().getMonth() && (
                  <p className="space-y-2 underline cursor-pointer text-gray-500">
                    Send mail
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Edit Company Profile
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      name="logo"
                      id="logo"
                      onChange={handleImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo"
                      className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {file ? file.name : "No file chosen"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
