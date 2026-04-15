import React from "react";

const Header = ({ title, description }) => {
  return (
    <div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-4  transition-all duration-200">
        <h1 className="text-2xl capitalize font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Header;
