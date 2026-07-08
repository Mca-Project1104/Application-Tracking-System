import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppProvider.jsx";
import api from "../../api/axios";
import Loading from "../Loading/Loading.jsx";
import { IoMdClose } from "react-icons/io";

const CompanyProfile = () => {
  const {
    token,
    companydata,
    refetchDashboard: fetchCompanyDashbord,
    refetchProfile: fetchProfile,
  } = useAppContext();

  const [file, setFile] = useState(null);
  const [profileData, setProfileData] = useState(companydata);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [subscription, setSubscription] = useState(
    companydata?.company?.subscription,
  );

  const [formData, setFormData] = useState({
    name: companydata?.company?.name,
    location: companydata?.company?.location,
  });

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

  if (!companydata == null) {
    setIsLoading(true);
    setProfileData(companydata);
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        await Promise.all([fetchProfile(), fetchCompanyDashbord()]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  console.log(companydata);

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

      const response = await api.post("/api/v1/company/profile", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        await fetchProfile();
        await fetchCompanyDashbord();

        setProfileData(response.data?.companyData || response.data);

        setSubscription(
          response.data?.companyData?.company?.subscription || null,
        );

        setMessage({
          text: "Profile updated successfully!",
          type: "success",
        });

        setFile(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const openModal = () => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="select-none">
      {message.text && (
        <div
          className={`p-4 mt-4 rounded ${
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
        className="bg-white rounded min-h-screen lg:h-[167.5] h-[195] // Fixed syntax for arbitrary values
          dark:bg-gray-800 p-4 shadow-md lg:p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Recruiter Profile
          </h1>
          {!isLoading && !companydata?.company?.name && (
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {companydata ? (
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
                    {companydata?.company?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-lg text-gray-800 dark:text-white">
                    {companydata?.company?.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative ">
              <h2 className=" text-lg text-center font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Company Logo
              </h2>
              <div className="flex h-22 justify-center-safe  rounded overflow-hidden ">
                {companydata?.company?.logo ? (
                  <img
                    src={companydata?.company?.logo}
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
                {companydata?.firstName} {companydata?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-lg text-gray-800 dark:text-white">
                {companydata?.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Type
              </p>
              <p className="text-lg text-gray-800 dark:text-white capitalize">
                {companydata?.accountType}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p
                className={`text-lg  ${
                  companydata?.status === "accepted"
                    ? "text-green-800 dark:text-green-600"
                    : "text-red-400 dark:text-red-600"
                }  capitalize`}
              >
                {companydata?.status}
              </p>
              {companydata?.status === "pending" &&
                new Date(companydata?.updatedAt).getMonth() <
                  new Date().getMonth() && (
                  <p className="space-y-2 underline cursor-pointer text-gray-500">
                    Send mail
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 capitalize">
            Subscription Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Plan
              </p>
              <p className="text-lg text-gray-800 dark:text-white capitalize font-semibold">
                {companydata?.company?.subscription?.plan || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p
                className={`text-lg capitalize ${
                  companydata?.company?.subscription?.status === "ACTIVE"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {companydata?.company?.subscription?.status || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Billing Cycle
              </p>
              <p className="text-lg text-gray-800 dark:text-white capitalize">
                {companydata?.company?.subscription?.billingCycle || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Payment ID
              </p>
              <p
                className="text-sm text-gray-800 dark:text-white font-mono truncate"
                title={subscription?.paymentId}
              >
                {companydata?.company?.subscription?.paymentId || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Start Date
              </p>
              <p className="text-lg text-gray-800 dark:text-white">
                {formatDate(companydata?.company?.subscription?.startDate)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Next Billing Date
              </p>
              <p className="text-lg text-gray-800 dark:text-white">
                {formatDate(companydata?.company?.subscription?.endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Edit Company Profile
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <IoMdClose className="h-6 w-6" />
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
