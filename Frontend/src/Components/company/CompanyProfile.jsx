import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../context/AppProvider.jsx";
import api from "../../api/axios";
import Loading from "../Loading/Loading.jsx";
import { toast } from "react-hot-toast";
import {
  Building2,
  User,
  CreditCard,
  LayoutGrid,
} from "lucide-react";

import CompanyHeroHeader from "./profile/CompanyHeroHeader.jsx";
import CompanyMetricRibbon from "./profile/CompanyMetricRibbon.jsx";
import CompanyOverviewCard from "./profile/CompanyOverviewCard.jsx";
import RecruiterAccountCard from "./profile/RecruiterAccountCard.jsx";
import CompanySubscriptionCard from "./profile/CompanySubscriptionCard.jsx";
import CompanyBrandCard from "./profile/CompanyBrandCard.jsx";
import CompanyWorkspaceShortcuts from "./profile/CompanyWorkspaceShortcuts.jsx";
import EditCompanyModal from "./profile/EditCompanyModal.jsx";

const CompanyProfile = () => {
  const {
    token,
    companydata,
    navigate,
    refetchDashboard: fetchCompanyDashbord,
    refetchProfile: fetchProfile,
  } = useAppContext();

  const [activeFilter, setActiveFilter] = useState("all");
  const [profileData, setProfileData] = useState(companydata);
  const [isLoading, setIsLoading] = useState(!companydata);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  // Sync profile data when context changes
  useEffect(() => {
    if (companydata) {
      setProfileData(companydata);
      setIsLoading(false);
    }
  }, [companydata]);

  // Load fresh profile & dashboard stats in background
  useEffect(() => {
    const loadData = async () => {
      if (!companydata) {
        setIsLoading(true);
      }
      try {
        await Promise.all([fetchProfile(), fetchCompanyDashbord(true)]);
      } catch (err) {
        console.error("Error refreshing profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const company = profileData?.company || companydata?.company || {};
  const subscription = company?.subscription || {};
  const limits = company?.limits || { maxJobs: 3, activeJobs: 0 };

  const activeJobs = limits.activeJobs || 0;
  const maxJobs = limits.maxJobs || 3;
  const quotaPercentage =
    maxJobs > 0 ? Math.min((activeJobs / maxJobs) * 100, 100) : 0;

  const handleOpenEdit = useCallback(() => {
    setFormData({
      name: company?.name || "",
      location: company?.location || "",
    });
    setFile(null);
    setImagePreview(company?.logo || null);
    setIsModalOpen(true);
  }, [company]);

  const handleCloseEdit = useCallback(() => {
    setIsModalOpen(false);
    setFile(null);
    setImagePreview(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Logo file size must be less than 5 MB");
        return;
      }
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const handleCopy = useCallback((text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading("Saving company profile changes...");

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name.trim());
      dataToSend.append("location", formData.location.trim());
      if (file) {
        dataToSend.append("logo", file);
      }

      const isExisting = Boolean(company?._id);
      const apiMethod = isExisting ? api.put : api.post;

      const response = await apiMethod("/api/v1/company/profile", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        await Promise.all([fetchProfile(), fetchCompanyDashbord(true)]);
        toast.success("Company profile updated successfully!", { id: toastId });
        handleCloseEdit();
      } else {
        toast.error(response.data?.message || "Failed to update profile", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile",
        { id: toastId }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !company?.name) {
    return <Loading detail="Loading company profile..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto space-y-6">

        {/* 1. HERO HEADER & METRIC RIBBON */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <CompanyHeroHeader
            company={company}
            profileData={profileData}
            subscription={subscription}
            onOpenEdit={handleOpenEdit}
            onNavigatePricing={() => navigate("/pricing")}
            onNavigatePostJob={() => navigate("/company/post_job")}
            formatDate={formatDate}
          />
          <CompanyMetricRibbon
            activeJobs={activeJobs}
            maxJobs={maxJobs}
            accountStatus={profileData?.status || "Accepted"}
            subscriptionStatus={subscription?.status || "Active"}
          />
        </div>

        {/* 2. SECTION FILTER PILLS */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: "all", label: "All Details", icon: LayoutGrid },
            { id: "overview", label: "Organization & Brand", icon: Building2 },
            { id: "account", label: "Recruiter Account", icon: User },
            { id: "subscription", label: "Plan & Quota", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. PROPERLY ARRANGED CONTENT GRID */}
        {(activeFilter === "all" || activeFilter === "overview") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Core Identity & Links */}
            <div className="lg:col-span-2 space-y-6">
              <CompanyOverviewCard
                company={company}
                onOpenEdit={handleOpenEdit}
                onCopy={handleCopy}
              />
              {activeFilter === "all" && (
                <RecruiterAccountCard
                  profileData={profileData}
                  onCopy={handleCopy}
                />
              )}
              <CompanyWorkspaceShortcuts onNavigate={navigate} />
            </div>

            {/* Right 1 Column: Brand & Plan Sidebar */}
            <div className="space-y-6">
              <CompanyBrandCard
                company={company}
                onOpenEdit={handleOpenEdit}
              />
              <CompanySubscriptionCard
                subscription={subscription}
                activeJobs={activeJobs}
                maxJobs={maxJobs}
                quotaPercentage={quotaPercentage}
                onNavigatePricing={() => navigate("/pricing")}
                onCopy={handleCopy}
                formatDate={formatDate}
              />
            </div>
          </div>
        )}

        {/* Individual Tab: Recruiter Account Only */}
        {activeFilter === "account" && (
          <div className="max-w-3xl space-y-6">
            <RecruiterAccountCard
              profileData={profileData}
              onCopy={handleCopy}
            />
            <CompanyWorkspaceShortcuts onNavigate={navigate} />
          </div>
        )}

        {/* Individual Tab: Plan & Quota Only */}
        {activeFilter === "subscription" && (
          <div className="max-w-3xl space-y-6">
            <CompanySubscriptionCard
              subscription={subscription}
              activeJobs={activeJobs}
              maxJobs={maxJobs}
              quotaPercentage={quotaPercentage}
              onNavigatePricing={() => navigate("/pricing")}
              onCopy={handleCopy}
              formatDate={formatDate}
            />
            <CompanyWorkspaceShortcuts onNavigate={navigate} />
          </div>
        )}

      </div>

      {/* 4. MODAL DIALOG COMPONENT */}
      <EditCompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseEdit}
        formData={formData}
        onInputChange={handleInputChange}
        imagePreview={imagePreview}
        file={file}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default CompanyProfile;
