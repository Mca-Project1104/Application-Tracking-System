import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppProvider";
import api from "../../api/axios";
import Loading from "../../Components/Loading/Loading";
// Helper to determine styling based on Plan Name
const getPlanStyles = (plan, isBorder = false) => {
  switch (plan) {
    case "PRO":
      return isBorder
        ? "border-purple-500 dark:border-purple-400"
        : "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
    case "BASIC":
      return isBorder
        ? "border-blue-500 dark:border-blue-400"
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "FREE":
    default:
      return isBorder
        ? "border-gray-300 dark:border-gray-600"
        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const Pricing = () => {
  const { navigate, token, companydata } = useAppContext();
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'yearly'
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [compnyId, setCompanyId] = useState("");

  const { currency } = useAppContext();

  // Fetch user's current subscription to highlight their active plan
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const res = await api.get("/api/company/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCompanyId(res.data.data._id);
        setCurrentPlan(res.data.subscription.plan || "FREE");
        setLoading(false);
      } catch (error) {
        console.log("Error fetching subscription:", error);
        setLoading(false);
      }
    };

    if (token) fetchCurrentPlan();
  }, [token]);

  // Pricing Data
  const plans = [
    {
      id: "free",
      name: "FREE",
      price: 0,
      yearlyPrice: 0,
      description: "Perfect for startups testing the waters.",
      features: [
        "3 Active Job Postings",
        "Basic Resume Parsing",
        "Standard Ranking Algorithm",
        "Community Support",
        "1 Team Seat",
      ],
      limits: { maxJobs: 3 },
      cta: "Current Plan",
      isPopular: false,
    },
    {
      id: "basic",
      name: "BASIC",
      price: 299,
      yearlyPrice: 240, // Approx 20% off
      description: "For growing teams needing smarter hiring.",
      features: [
        "15 Active Job Postings",
        "AI-Powered Keyword Ranking",
        "Bulk Candidate Import",
        "Email Support (24hr response)",
        "5 Team Seats",
      ],
      limits: { maxJobs: 15 },
      cta: "Upgrade to Basic",
      isPopular: true,
    },
    {
      id: "pro",
      name: "PRO",
      price: 799,
      yearlyPrice: 639,
      description: "Advanced AI features for high-volume hiring.",
      features: [
        "Unlimited Job Postings",
        "Semantic NLP Scoring",
        "Custom AI Model Training",
        "Priority Phone Support",
        "Unlimited Team Seats",
        "API Access & Webhooks",
      ],
      limits: { maxJobs: 9999 },
      cta: "Upgrade to Pro",
      isPopular: false,
    },
  ];

  const handleSubscribe = async (planName) => {
    try {
      setProcessing(planName);
      setLoading(true);

      const res = await api.post(
        "/api/payment/create-checkout-session",
        {
          plan: planName,
          billingCycle,
          id: compnyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.data?.url) {
        throw new Error("Stripe URL not received");
      }

      window.location.href = res.data.url;
      setLoading(false);
    } catch (err) {
      console.error("Stripe redirect error:", err);
      alert("Payment failed. Try again.");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <Loading detail={"Loading pricing plans..."} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              billingCycle === "yearly"
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="flex items-center space-x-1">
            <span
              className={`text-sm font-medium ${
                billingCycle === "yearly"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Yearly
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
              SAVE 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const isActive = currentPlan === plan.name;
            const displayPrice =
              billingCycle === "monthly" ? plan.price : plan.yearlyPrice;
            const period =
              billingCycle === "monthly" ? "/mo" : "/mo (billed yearly)";

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                  isActive
                    ? "border-green-500 dark:border-green-400 ring-1 ring-green-500 dark:ring-green-400"
                    : getPlanStyles(plan.name, true)
                } flex flex-col`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 w-32 h-32 overflow-hidden rounded-full">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-10 py-1 transform rotate-45 translate-x-6 translate-y-4 shadow-md">
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="p-8 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 h-10">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      {currency}
                      {displayPrice}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                      {plan.price === 0 ? "" : period}
                    </span>
                  </div>

                  {/* Active Plan Indicator */}
                  {isActive && (
                    <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Current Plan
                    </div>
                  )}

                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="shrink-0">
                          <svg
                            className="h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-b-2xl border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={async () => {
                      setProcessing(plan.name);
                      await handleSubscribe(plan.name);
                    }}
                    disabled={isActive}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        : plan.name === "PRO"
                          ? "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md hover:shadow-lg"
                          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isActive ? "Active" : plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
