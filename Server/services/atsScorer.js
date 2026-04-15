// services/atsScorer.js

export const calculateATSScore = (resume, jobDescription) => {
  const jd = (jobDescription || "").toLowerCase();

  const skills = Array.isArray(resume.skills)
    ? resume.skills.map((s) => (s?.name || "").toLowerCase()).filter(Boolean)
    : [];
  const skillMatch = skills.filter((skill) => jd.includes(skill)).length;
  const skillScore = skills.length > 0 ? (skillMatch / skills.length) * 40 : 0;

  const expYears = Array.isArray(resume.experience)
    ? resume.experience.length * 2
    : 0;
  const expScore = Math.min(25, expYears * 2);

  const eduScore = jd.includes("bachelor") ? 10 : 5;

  const words = jd.split(" ").filter(Boolean);
  const normalizedResume = JSON.stringify(resume).toLowerCase();
  const matchWords = words.filter((word) => normalizedResume.includes(word));
  const keywordScore =
    words.length > 0 ? (matchWords.length / words.length) * 15 : 0;

  const projectScore =
    Array.isArray(resume.projects) && resume.projects.length > 0 ? 10 : 5;

  const total = skillScore + expScore + eduScore + keywordScore + projectScore;
  const result = Math.round(total);

  return Number.isFinite(result) ? Math.min(100, result) : 0;
};
