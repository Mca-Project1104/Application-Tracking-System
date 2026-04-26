import React from "react";
import { useAppContext } from "../../context/AppProvider";

const BillingCancel = () => {
  const { navigate } = useAppContext();

  useEffect(() => {
    setTimeout(() => {
      navigate("/company");
    }, 4000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div className="text-red-500 text-5xl mb-4">✖</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Your payment was not completed. You can try again anytime.
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Back to Pricing
        </button>
      </div>
    </div>
  );
};

export default BillingCancel;
