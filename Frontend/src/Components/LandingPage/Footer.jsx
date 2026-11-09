import React, { memo, useEffect, useId, useState } from "react";
import hireflow from "../../assets/HIRE_FLOW.png";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com/hireflow",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/hireflow",
    path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/hireflow",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

// Update the hrefs to match your real routes.
const LINK_SECTIONS = [
  {
    title: "For Candidates",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Career Resources", href: "/resources" },
      { label: "Resume Builder", href: "/resume-builder" },
      { label: "Salary Calculator", href: "/salary-calculator" },
    ],
  },
  {
    title: "For Recruiters",
    links: [
      { label: "Post a Job", href: "/post-job" },
      { label: "Pricing Plans", href: "/pricing" },
      { label: "Recruiting Tools", href: "/recruiting-tools" },
      { label: "API Access", href: "/api" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

/* -------------------------------------------------------------------------- */
/*  Constants & helpers                                                       */
/* -------------------------------------------------------------------------- */

const CURRENT_YEAR = new Date().getFullYear();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACK_TO_TOP_THRESHOLD = 400; // px scrolled before the button appears

// Visible keyboard focus on a dark background. Swap the color to match your brand.
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";

const scrollToTop = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
};

// TODO: replace with a real API call, e.g. await api.post("/newsletter", { email }).
const defaultSubscribe = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
};

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

const SocialLink = memo(({ label, href, path }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`HireFlow on ${label}`}
    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-gray-700 hover:text-white ${FOCUS_RING}`}
  >
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  </a>
));
SocialLink.displayName = "SocialLink";

const LinkColumn = memo(({ title, links }) => {
  const headingId = useId();

  return (
    <nav aria-labelledby={headingId}>
      <h3 id={headingId} className="mb-4 text-lg font-semibold text-white">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className={`rounded transition-colors hover:text-white ${FOCUS_RING}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
LinkColumn.displayName = "LinkColumn";

/**
 * Newsletter signup with validation and loading / success / error states.
 * @param {{ onSubscribe: (email: string) => Promise<void> }} props
 */
const NewsletterForm = ({ onSubscribe }) => {
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setStatus("error");
      setMessage("Enter a valid email address, like name@example.com.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await onSubscribe(value);
      setStatus("success");
      setMessage("Thanks, you're subscribed.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-sm">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
        Get new jobs and hiring tips by email
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          aria-invalid={status === "error"}
          aria-describedby={messageId}
          className={`min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 disabled:opacity-60 ${FOCUS_RING}`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
        >
          {isLoading ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p
        id={messageId}
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-5 text-sm ${status === "error" ? "text-red-400" : "text-green-400"
          }`}
      >
        {message}
      </p>
    </form>
  );
};


const Footer = ({ onSubscribe = defaultSubscribe }) => {
  return (
    <>
      <footer
        aria-labelledby="footer-heading"
        className="border-t border-gray-800 bg-gray-900 py-16 text-gray-400 dark:bg-gray-950"
      >
        <h2 id="footer-heading" className="sr-only">
          HireFlow footer
        </h2>

        <div className="container mx-auto px-6">
          <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 md:gap-8">
            {/* Brand + newsletter */}
            <div className="col-span-2">
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="HireFlow, back to top"
                className={`mb-4 flex items-center space-x-2 rounded ${FOCUS_RING}`}
              >
                <img
                  src={hireflow}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded bg-gray-950 object-contain"
                />
                <span className="text-2xl font-bold text-white">HireFlow</span>
              </button>

              <p className="mb-4 max-w-md leading-relaxed text-gray-400">
                Connecting talent with opportunity through intelligent matching
                and seamless collaboration.
              </p>

              <ul className="flex space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <SocialLink {...social} />
                  </li>
                ))}
              </ul>

              <NewsletterForm onSubscribe={onSubscribe} />
            </div>

            {/* Link columns */}
            {LINK_SECTIONS.map((section) => (
              <LinkColumn key={section.title} {...section} />
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
            <p className="mb-4 text-sm text-gray-400 md:mb-0">
              &copy; {CURRENT_YEAR} HireFlow. All rights reserved.
            </p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className={`rounded transition-colors hover:text-white ${FOCUS_RING}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </footer>

    </>
  );
};

export default memo(Footer);