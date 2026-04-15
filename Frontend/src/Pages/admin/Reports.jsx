import React from "react";

const Reports = () => {
  return (
    <section id="reports">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Hiring Report
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Comprehensive report on hiring metrics and trends
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              Generate Report
            </button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              User Activity Report
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Detailed analysis of user engagement and activity
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              Generate Report
            </button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Job Performance Report
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Insights on job posting performance and effectiveness
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              Generate Report
            </button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Time to Hire Analysis
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Analysis of hiring cycle times and bottlenecks
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              Generate Report
            </button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Source Effectiveness
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Evaluation of candidate sources and channels
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              Generate Report
            </button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
              Diversity Metrics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Reports on diversity and inclusion in hiring
            </p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reports;
