import React from "react";

const Setting = () => {
  return (
    <div className="">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
          <div className="px-4 py-3 sm:p-6">
            <div className="mt-5 space-y-6">
              <div>
                <label
                  htmlFor="site-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Site Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="site-name"
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    defaultValue="Hire Flow"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="site-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Site Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="site-description"
                    rows={3}
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    defaultValue="A modern applicant tracking system for streamlining your hiring process."
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Contact Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="contact-email"
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    defaultValue="support@talenttrack.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Notifications
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="new-application"
                      name="new-application"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      defaultChecked
                    />
                    <label
                      htmlFor="new-application"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Notify on new job applications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="new-user"
                      name="new-user"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      defaultChecked
                    />
                    <label
                      htmlFor="new-user"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Notify on new user registration
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="system-updates"
                      name="system-updates"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                    <label
                      htmlFor="system-updates"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Notify on system updates
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Security Settings
            </h3>
            <div className="mt-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password Policy
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="min-length"
                      name="min-length"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      defaultChecked
                    />
                    <label
                      htmlFor="min-length"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Require minimum password length of 8 characters
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="special-chars"
                      name="special-chars"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      defaultChecked
                    />
                    <label
                      htmlFor="special-chars"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Require special characters
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="password-expiry"
                      name="password-expiry"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                    <label
                      htmlFor="password-expiry"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Require password change every 90 days
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="session-timeout"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Session Timeout (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="session-timeout"
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    defaultValue="30"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
