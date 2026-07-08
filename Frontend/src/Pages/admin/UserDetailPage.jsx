import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../Components/Loading/Loading";

const cleanArr = (arr) =>
  Array.isArray(arr)
    ? arr.filter((x) => x && x.trim() !== "" && x.trim() !== "Not detected")
    : [];

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const groupBlocks = (arr, headRe) => {
  const lines = cleanArr(arr);
  const blocks = [];
  let cur = [];
  for (const line of lines) {
    if (headRe.test(line.trim()) && cur.length) {
      blocks.push(cur);
      cur = [];
    }
    cur.push(line);
  }
  if (cur.length) blocks.push(cur);
  return blocks;
};

const Badge = ({ children, variant = "indigo" }) => {
  const v = {
    indigo:
      "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-800",
    sky: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800",
    green:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
    amber:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
    rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800",
    violet:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ring-1 ${v[variant]}`}
    >
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white text-slate-900 dark:bg-gray-800 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-sm">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
      {children}
    </span>
    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
  </div>
);

const InfoItem = ({ icon, label, value, href }) => (
  <div className="flex items-start gap-3">
    <span className="text-base mt-0.5 leading-none">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 wrap-break-words">
          {value || "—"}
        </p>
      )}
    </div>
  </div>
);

const Avatar = ({
  src,
  name,
  size = "w-24 h-24",
  rounded = "rounded-full",
}) => {
  const [err, setErr] = useState(false);
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (src && !err)
    return (
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        className={`${size} ${rounded} object-cover border-4 border-white dark:border-slate-800 shadow-lg shrink-0`}
      />
    );

  return (
    <div
      className={`${size} ${rounded} flex items-center justify-center text-2xl font-black text-white shrink-0 border-4 border-white dark:border-slate-800 shadow-lg bg-linear-to-br from-indigo-600 to-violet-600`}
    >
      {initials}
    </div>
  );
};

const AtsRing = ({ score = 0 }) => {
  const R = 36,
    C = 2 * Math.PI * R;
  const pct = Math.min(Math.max(score, 0), 100);
  const stroke = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";
  const label = pct >= 70 ? "Strong" : pct >= 40 ? "Average" : "Weak";
  const textCol =
    pct >= 70
      ? "text-emerald-500"
      : pct >= 40
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <svg width={88} height={88} viewBox="0 0 88 88">
        <circle
          cx={44}
          cy={44}
          r={R}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={8}
        />
        <circle
          cx={44}
          cy={44}
          r={R}
          fill="none"
          stroke={stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (C * pct) / 100}
          transform="rotate(-90 44 44)"
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <text
          x={44}
          y={50}
          textAnchor="middle"
          fontSize={18}
          fontWeight={800}
          fill={stroke}
          fontFamily="'Plus Jakarta Sans',sans-serif"
        >
          {pct}
        </text>
      </svg>
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${textCol}`}
      >
        {label} ATS
      </span>
    </div>
  );
};

const StatBox = ({
  icon,
  label,
  value,
  sub,
  colorClass = "text-indigo-600",
}) => (
  <div className="bg-white text-slate-900 dark:bg-gray-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-1">
    <span className="text-xl">{icon}</span>
    <span className={`text-2xl font-black ${colorClass}`}>{value}</span>
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </span>
    {sub && (
      <span className="text-[10px] text-slate-400 dark:text-slate-500">
        {sub}
      </span>
    )}
  </div>
);

const PlanBadge = ({ plan, status }) => {
  const active = status === "ACTIVE";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
          plan === "FREE"
            ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        }`}
      >
        {plan}
      </span>
      <span
        className={`flex items-center gap-1 text-xs font-semibold ${
          active
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-500 dark:text-rose-400"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${active ? "bg-emerald-500" : "bg-rose-400"}`}
        />
        {status}
      </span>
    </div>
  );
};

const JobUsageBar = ({ active, max }) => {
  const pct = max > 0 ? Math.round((active / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Active Jobs
        </span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {active} / {max}
        </span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
        {max - active} slot{max - active !== 1 ? "s" : ""} remaining
      </p>
    </div>
  );
};

const EducationSection = ({ raw }) => {
  const blocks = groupBlocks(
    raw,
    /^(Masters|Bachelor|Master|B\.|M\.|PhD|Diploma)/i,
  );
  if (!blocks.length) return null;
  return (
    <Card>
      <SectionTitle icon="🎓">Education</SectionTitle>
      <div className="flex flex-col gap-5">
        {blocks.map((block, i) => (
          <div key={i} className="pl-4 border-l-[3px] border-indigo-500">
            {block.map((line, j) => (
              <p
                key={j}
                className={`leading-relaxed ${
                  j === 0
                    ? "text-sm font-bold text-slate-900 dark:text-slate-100"
                    : j === 1
                      ? "text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                      : "text-xs text-slate-500 dark:text-slate-400"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

const ProjectsSection = ({ raw }) => {
  const blocks = groupBlocks(raw, /^(❖|•\s*❖)/);
  if (!blocks.length) return null;
  return (
    <Card>
      <SectionTitle icon="🚀">Projects</SectionTitle>
      <div className="flex flex-col gap-3">
        {blocks.map((block, i) => {
          const title = block[0].replace(/^[•\s]*❖\s*/, "").trim();
          const rest = block.slice(1).filter((l) => l.trim());
          return (
            <div
              key={i}
              className="bg-white text-slate-900 dark:bg-gray-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-colors duration-200"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                {title}
              </p>
              {rest.map((line, j) => {
                const text = line.replace(/^•\s*/, "").trim();
                const isTech = /^Technology:/i.test(text);
                const isDeploy = /^Deploy/i.test(text);
                return (
                  <p
                    key={j}
                    className={`text-xs leading-relaxed ${
                      isTech
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                        : isDeploy
                          ? "text-sky-600 dark:text-sky-400 font-semibold"
                          : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isTech || isDeploy ? text : `• ${text}`}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const ResumePreview = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <SectionTitle icon="📝">Extracted Resume Text</SectionTitle>
        <span className="text-slate-400 dark:text-slate-500 text-sm -mt-4">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <pre className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap wrap-break-word bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto">
          {text}
        </pre>
      )}
    </Card>
  );
};

const CandidateDetail = ({ userData, typeData }) => {
  const skills = cleanArr(typeData.skills);
  const certs = cleanArr(typeData.certifications);
  const languages = cleanArr(typeData.languages);
  const experience = cleanArr(typeData.experience);

  const socials = [
    { icon: "🔗", label: "LinkedIn", val: typeData.linkedin },
    { icon: "🐙", label: "GitHub", val: typeData.github },
    { icon: "🐦", label: "Twitter", val: typeData.twitter },
    { icon: "🌐", label: "Website", val: typeData.website },
  ].filter((s) => s.val);

  return (
    <div className="grid grid-cols-[260px_1fr] gap-5 items-start">
      <div className="flex flex-col gap-4">
        {skills.length > 0 && (
          <Card>
            <SectionTitle icon="⚡">Skills</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 capitalize"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>
        )}

        {certs.length > 0 && (
          <Card>
            <SectionTitle icon="🏅">Certifications</SectionTitle>
            <ul className="list-disc list-inside space-y-1.5">
              {certs.map((c, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {languages.length > 0 && (
          <Card>
            <SectionTitle icon="🌍">Languages</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span
                  key={l}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-sky-700 dark:bg-slate-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900"
                >
                  {l}
                </span>
              ))}
            </div>
          </Card>
        )}

        {socials.length > 0 && (
          <Card>
            <SectionTitle icon="🔗">Links</SectionTitle>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <InfoItem
                  key={s.label}
                  icon={s.icon}
                  label={s.label}
                  value={s.val}
                  href={s.val}
                />
              ))}
            </div>
          </Card>
        )}

        <Card>
          <SectionTitle icon="🔐">Account Info</SectionTitle>
          <div className="flex flex-col gap-3">
            <InfoItem icon="✉️" label="Login Email" value={userData.email} />
            <InfoItem icon="📧" label="Profile Email" value={typeData.email} />
            <InfoItem
              icon="🔑"
              label="Account Type"
              value={userData.accountType}
            />
            <InfoItem icon="🪪" label="User ID" value={userData._id} />
            <InfoItem
              icon="🗓️"
              label="Joined"
              value={fmtDate(userData.createdAt)}
            />
            <InfoItem
              icon="🔄"
              label="Profile Updated"
              value={fmtDate(typeData.updatedAt)}
            />
          </div>
        </Card>

        {typeData.resumeUrl && (
          <a
            href={`http://localhost:8000/${typeData.resumeUrl.trim()}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200 hover:-translate-y-0.5"
          >
            📄 View / Download Resume
          </a>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <EducationSection raw={typeData.education} />
        <ProjectsSection raw={typeData.projects} />
        {experience.length > 0 && (
          <Card>
            <SectionTitle icon="💼">Experience</SectionTitle>
            <div className="flex flex-col gap-4">
              {experience.map((exp, i) => (
                <div key={i} className="pl-4 border-l-[3px] border-violet-500">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {exp}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
        {typeData.resumeText && <ResumePreview text={typeData.resumeText} />}
      </div>
    </div>
  );
};

const CompanyDetail = ({ userData, typeData }) => {
  const sub = typeData.subscription ?? {};
  const limits = typeData.limits ?? {};

  return (
    <div className="grid grid-cols-[260px_1fr] gap-5 items-start">
      <div className="flex flex-col gap-4">
        <Card>
          <SectionTitle icon="💳">Subscription</SectionTitle>
          <div className="flex flex-col gap-4">
            <PlanBadge
              plan={sub.plan ?? typeData.currentPlan?.toUpperCase() ?? "FREE"}
              status={sub.status ?? "ACTIVE"}
            />
            {sub.endDate && (
              <InfoItem
                icon="📅"
                label="Plan Expires"
                value={fmtDate(sub.endDate)}
              />
            )}
            {sub.billingCycle && (
              <InfoItem
                icon="🔁"
                label="Billing Cycle"
                value={sub.billingCycle}
              />
            )}
            {sub.stripeCustomerId && (
              <InfoItem
                icon="💰"
                label="Stripe Customer"
                value={sub.stripeCustomerId}
              />
            )}
          </div>
        </Card>

        {limits.maxJobs !== undefined && (
          <Card>
            <SectionTitle icon="📋">Job Posting Limits</SectionTitle>
            <JobUsageBar
              active={limits.activeJobs ?? 0}
              max={limits.maxJobs ?? 0}
            />
          </Card>
        )}

        <Card>
          <SectionTitle icon="🔐">Account Info</SectionTitle>
          <div className="flex flex-col gap-3">
            <InfoItem icon="✉️" label="Email" value={userData.email} />
            <InfoItem
              icon="🔑"
              label="Account Type"
              value={userData.accountType}
            />
            <InfoItem icon="🪪" label="User ID" value={userData._id} />
            <InfoItem icon="🏢" label="Company ID" value={typeData._id} />
            <InfoItem
              icon="🗓️"
              label="Joined"
              value={fmtDate(userData.createdAt)}
            />
            <InfoItem
              icon="🔄"
              label="Last Updated"
              value={fmtDate(typeData.updatedAt)}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <StatBox
            icon="✅"
            label="Active Jobs"
            value={limits.activeJobs ?? 0}
            sub={`of ${limits.maxJobs ?? "—"} allowed`}
            colorClass="text-indigo-600 dark:text-indigo-400"
          />
          <StatBox
            icon="📦"
            label="Job Slots Left"
            value={(limits.maxJobs ?? 0) - (limits.activeJobs ?? 0)}
            colorClass="text-emerald-600 dark:text-emerald-400"
          />
          <StatBox
            icon="🗓️"
            label="Plan Expires"
            value={sub.endDate ? fmtDate(sub.endDate) : "—"}
            colorClass="text-amber-600 dark:text-amber-400"
          />
        </div>

        <Card>
          <SectionTitle icon="🏢">Company Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {typeData.logo ? (
                <img
                  src={typeData.logo}
                  alt={typeData.name}
                  className="w-14 h-14 rounded-xl object-contain bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0">
                  🏢
                </div>
              )}
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {typeData.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  📍 {typeData.location}
                </p>
                {typeData.isVerified && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✅ Verified Company
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon="🏷️" label="Company Name" value={typeData.name} />
              <InfoItem icon="📍" label="Location" value={typeData.location} />
              <InfoItem
                icon="💼"
                label="Current Plan"
                value={(typeData.currentPlan ?? "free").toUpperCase()}
              />
              <InfoItem
                icon="📅"
                label="Company Since"
                value={fmtDate(typeData.createdAt)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle icon="💳">Subscription Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon="📦" label="Plan" value={sub.plan ?? "FREE"} />
            <InfoItem icon="🟢" label="Status" value={sub.status ?? "—"} />
            <InfoItem
              icon="🔁"
              label="Billing Cycle"
              value={sub.billingCycle ?? "N/A"}
            />
            <InfoItem
              icon="📅"
              label="Start Date"
              value={fmtDate(sub.startDate)}
            />
            <InfoItem icon="⌛" label="End Date" value={fmtDate(sub.endDate)} />
            <InfoItem
              icon="🆔"
              label="Payment ID"
              value={sub.paymentId ?? "N/A"}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const UserDetailPage = ({ id }) => {
  const [userData, setUserData] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const res = await api.post("/api/v1/admin/user/detail", { id });
        const inner = res.data?.data;
        setUserData(inner?.user ?? null);
        setTypeData(inner?.type ?? null);
      } catch (err) {
        console.error(err);
        setError("Could not load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
  }, []);

  if (loading) return <Loading detail={"Loading profile…"} />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-950">
        <span className="text-4xl">⚠️</span>
        <p className="text-red-500 font-semibold text-sm">{error}</p>
      </div>
    );

  if (!userData || !typeData) return null;

  const acctType = userData.accountType ?? "candidate";
  const isCandidate = acctType === "candidate";
  const isCompany = acctType === "company";

  const fullName = isCandidate
    ? `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim()
    : (typeData.name ??
      `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim());

  const avatarSrc = isCandidate ? typeData.profile_image : typeData.logo;
  const avatarRounded = isCompany ? "rounded-2xl" : "rounded-full";

  const contactStrip = isCandidate
    ? [
        { icon: "✉️", val: userData.email },
        {
          icon: "📞",
          val:
            typeData.phone && typeData.phone !== "+91 -"
              ? typeData.phone
              : null,
        },
        { icon: "📍", val: typeData.location },
        {
          icon: "🗓️",
          val: userData.createdAt
            ? `Joined ${fmtDate(userData.createdAt)}`
            : null,
        },
      ].filter((x) => x.val)
    : [
        { icon: "✉️", val: userData.email },
        { icon: "📍", val: typeData.location },
        {
          icon: "🗓️",
          val: userData.createdAt
            ? `Joined ${fmtDate(userData.createdAt)}`
            : null,
        },
      ].filter((x) => x.val);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-gray-950 dark:text-slate-100 p-1 rounded-2xl">
      <div className="relative h-20 overflow-hidden">
        {[100, 180, 380].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/5"
            style={{ width: s, height: s, right: -s * 0.15 }}
          />
        ))}
      </div>

      <div className="max-w-8xl mx-auto pb-5">
        <Card className="-mt-19 relative z-10 mb-6 p-6">
          <div className="flex flex-wrap gap-5 items-start">
            <Avatar
              src={avatarSrc}
              name={fullName}
              size="w-24 h-24"
              rounded={avatarRounded}
            />

            <div className="flex-1 min-w-50">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                  {fullName}
                </h1>

                <Badge
                  variant={isCandidate ? "indigo" : isCompany ? "green" : "sky"}
                >
                  {isCandidate
                    ? "🎯 Candidate"
                    : isCompany
                      ? "🏢 Company"
                      : "🧑‍💼 Recruiter"}
                </Badge>

                {userData.isVerified && (
                  <Badge variant="green">✅ Verified</Badge>
                )}

                {userData.status && (
                  <Badge
                    variant={userData.status === "accepted" ? "green" : "amber"}
                  >
                    {userData.status.charAt(0).toUpperCase() +
                      userData.status.slice(1)}
                  </Badge>
                )}

                {!isCandidate && typeData.subscription?.plan && (
                  <Badge
                    variant={
                      typeData.subscription.plan === "FREE" ? "violet" : "amber"
                    }
                  >
                    💳 {typeData.subscription.plan}
                  </Badge>
                )}
              </div>

              {isCandidate && typeData.personal && (
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mb-3">
                  {typeData.personal}
                </p>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {contactStrip.map((x) => (
                  <span
                    key={x.val}
                    className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
                  >
                    {x.icon} {x.val}
                  </span>
                ))}
              </div>
            </div>

            {isCandidate ? (
              <AtsRing score={typeData.ats_score} />
            ) : (
              <div className="flex flex-col items-center gap-1 shrink-0 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-center">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {typeData.limits?.activeJobs ?? 0}
                  <span className="text-slate-300 dark:text-slate-600 font-light">
                    {" "}
                    /{" "}
                  </span>
                  {typeData.limits?.maxJobs ?? 0}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Active Jobs
                </span>
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{
                      width: `${
                        typeData.limits?.maxJobs
                          ? Math.round(
                              (typeData.limits.activeJobs /
                                typeData.limits.maxJobs) *
                                100,
                            )
                          : 0
                      }%`,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {isCandidate ? (
          <CandidateDetail userData={userData} typeData={typeData} />
        ) : (
          <CompanyDetail userData={userData} typeData={typeData} />
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
