import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAppContext } from "../../context/AppProvider";

const BillingSuccess = () => {
  const { token, navigate } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      navigate("/company");
    }, 4000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-8 flex flex-col items-center justify-center border-b border-green-100 dark:border-green-800">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 animate-bounce shadow-sm">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
              Thank you for upgrading your plan.
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Need help? Contact{" "}
            <span className="underline cursor-pointer">
              support@example.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingSuccess;
