import { useEffect, useState } from "react";
import { ArrowRight, CircleX, CreditCard, LayoutDashboard } from "lucide-react";
import { useAppContext } from "../../context/AppProvider";

const BillingCancel = () => {
  const { navigate } = useAppContext();
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      navigate("/company");
    }, 5000);

    const countdownTimer = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 text-gray-900 dark:bg-gray-900 dark:text-white">
      <section
        aria-labelledby="payment-cancelled-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20"
      >
        <div className="flex flex-col items-center border-b border-gray-100 bg-red-50/70 px-6 py-8 text-center dark:border-gray-700 dark:bg-red-950/20 sm:px-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
            <CircleX aria-hidden="true" className="h-9 w-9" strokeWidth={1.8} />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
            Checkout not completed
          </p>
          <h1
            id="payment-cancelled-title"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Payment cancelled
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-300">
            No payment was taken. Your current plan remains active, and you can
            return to pricing whenever you’re ready.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/pricing")}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            >
              <CreditCard aria-hidden="true" className="h-4 w-4" />
              Return to pricing
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/company")}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-800"
            >
              <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
              Go to dashboard
            </button>
          </div>
          <p
            aria-live="polite"
            className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400"
          >
            Returning to your dashboard in {secondsRemaining}{" "}
            {secondsRemaining === 1 ? "second" : "seconds"}.
          </p>
        </div>
      </section>
    </main>
  );
};

export default BillingCancel;
