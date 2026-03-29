import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = ({ setUserRole }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setUserRole(role);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Choose Your Role
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select how you'll be using TalentTrack
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleRoleSelect("candidate")}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0 bg-blue-100 rounded-md p-3">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      Job Seeker
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      Find your dream job, track applications, and get resume
                      insights
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Browse and apply to jobs</li>
                    <li>Track application status</li>
                    <li>Get resume analysis</li>
                    <li>Receive job recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Continue as Job Seeker →
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleRoleSelect("company")}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0 bg-blue-100 rounded-md p-3">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      Employer
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      Post jobs, manage applicants, and streamline your hiring
                      process
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Post and manage job listings</li>
                    <li>Track applicants through pipeline</li>
                    <li>Analyze resumes</li>
                    <li>Communicate with candidates</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Continue as Employer →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
