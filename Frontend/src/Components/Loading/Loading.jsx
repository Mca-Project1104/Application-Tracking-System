import React from "react";

const Loading = ({ detail }) => {
  return (
    <div>
      <div className="w-full bg-gray-50 dark:bg-gray-900 transition-colors mt-2 duration-200">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-full overflow-x-hidden">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
