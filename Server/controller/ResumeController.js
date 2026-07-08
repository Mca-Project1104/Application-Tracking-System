import fs from "fs";
import { createRequire } from "module";
import Candidate from "../model/CandidateModel.js";
import {
  SKILL_LIST,
  REGEX_PATTERNS,
  STOP_WORDS,
  SECTION_HEADER_WORDS,
} from "../SkillData.js";

const require = createRequire(import.meta.url);

// const REGEX_PATTERNS = {
//   email: /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,

//   phone:
//     /(?:\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4})|(?:(?:\+91[\s-]?)?[6-9]\d{9})|(?:\+\d{1,3}[\s-]?\d{6,14})/g,

//   linkedin: /(?:linkedin\.com\/in\/|linkedin:\s*)([A-Za-z0-9\-_%]+)/i,
//   github: /(?:github\.com\/|github:\s*)([A-Za-z0-9\-_%]+)/i,
//   website:
//     /(?:portfolio|website|site|web)[\s:\-]*([https://www\.][A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/i,
//   twitter: /(?:twitter\.com\/|twitter:\s*@?|x\.com\/)([A-Za-z0-9_]+)/i,

//   location: /\b([A-Za-z\s]+),\s*([A-Za-z\s]+)(?:,\s*([A-Za-z\s]+))?\b/,

//   locationKeywords:
//     /buffalo|new\s*york|albany|rochester|manhattan|brooklyn|bronx|queens|staten\s*island|ahmedabad|surat|baroda|vadodara|rajkot|gandhinagar|mumbai|pune|delhi|bangalore|bengaluru|hyderabad|chennai|kolkata|jaipur|india|gujarat|maharashtra|karnataka|tamil\s*nadu|west\s*bengal/i,

//   nameSkipPatterns: [
//     /@/,
//     /\d{5,}/,
//     /http|www\.|linkedin|github/i,
//     /resume|cv|curriculum/i,
//   ],
//   validName: /^[A-Za-z]+([\s'\-][A-Za-z]+){0,4}$/,

//   summaryHeaders: [
//     /^summary$/i,
//     /^objective$/i,
//     /^profile$/i,
//     /^about\s*me$/i,
//     /^overview$/i,
//     /^professional\s*summary$/i,
//     /^career\s*(objective|summary|profile)/i,
//   ],

//   education: [
//     /^education$/i,
//     /academic\s*(background|qualifications?)?/i,
//     /^qualifications?$/i,
//     /^degrees?$/i,
//   ],

//   experience: [
//     /work\s*experience/i,
//     /^experience$/i,
//     /employment(\s*history)?/i,
//     /professional\s*experience/i,
//   ],

//   experienceExit:
//     /^(education|skills|projects|certifications|references|awards|achievements|leadership|honors|activities|volunteer|publications|languages)/i,

//   projects: [/^projects?$/i, /personal\s*projects?/i, /academic\s*projects?/i],

//   certifications: [
//     /certifications?/i,
//     /licenses?\s*&?\s*certifications?/i,
//     /courses?/i,
//     /training/i,
//   ],

//   languages: [/^languages?$/i, /language\s*skills?/i],

//   defaultSectionExit:
//     /^(experience|employment|work\s*history|skills|projects|certifications|education|references|awards|achievements|leadership|honors|activities|volunteer|publications|languages)/i,
// };

const isSectionHeader = (line) => {
  const clean = line
    .replace(/[^A-Z&/ ]/g, "")
    .trim()
    .toUpperCase();
  if (!clean) return false;
  if (SECTION_HEADER_WORDS.has(clean)) return true;
  for (const h of SECTION_HEADER_WORDS) {
    if (clean.startsWith(h)) return true;
  }
  return false;
};

const cleanResumeText = (raw) => {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.replace(/ {2,}/g, " ").trim());

  const isFragment = (line) => {
    if (!line) return false;
    if (isSectionHeader(line)) return false;
    if (/[.!?]$/.test(line)) return false;
    return line.length <= 35;
  };

  const result = [];
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];
    if (!line) {
      i++;
      continue;
    }

    while (true) {
      let j = i + 1;
      while (j < lines.length && lines[j] === "") j++;
      if (j >= lines.length) break;

      const next = lines[j];
      const blanksBetween = j - (i + 1);

      if (
        blanksBetween > 0 &&
        isFragment(line) &&
        isFragment(next) &&
        !isSectionHeader(next)
      ) {
        line = (line + " " + next).replace(/ {2,}/g, " ").trim();
        i = j;
      } else {
        break;
      }
    }

    result.push(line);
    i++;
  }

  return result.join("\n");
};

const getPdfParser = async () => {
  const pdfModule = require("pdf-parse");
  return pdfModule.default || pdfModule;
};

const extractText = async (file) => {
  if (!file) throw new Error("No file uploaded");

  const filePath = file.path;
  const ext = file.originalname.split(".").pop().toLowerCase();
  let raw = "";

  if (ext === "pdf") {
    const pdfParse = await getPdfParser();
    const data = await pdfParse(fs.readFileSync(filePath));
    raw = data.text;
  } else if (ext === "docx") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    raw = result.value;
  } else {
    throw new Error("Unsupported file format; only PDF and DOCX supported");
  }

  return cleanResumeText(raw);
};

const extractSection = (text, headerPatterns, exitPatterns = null) => {
  const lines = text.split("\n").map((l) => l.trim());
  const defaultExit = exitPatterns || REGEX_PATTERNS.defaultSectionExit;

  let inSection = false;
  const collected = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (headerPatterns.some((re) => re.test(line))) {
      inSection = true;
      continue;
    }
    if (inSection && defaultExit.test(line)) break;
    if (inSection && line.length > 5) collected.push(line);
  }

  return collected;
};

const extractBasicInfo = (text) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const emailMatch = text.match(REGEX_PATTERNS.email);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = text.match(REGEX_PATTERNS.phone);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, " ").trim() : null;

  const linkedinMatch = text.match(REGEX_PATTERNS.linkedin);
  const linkedin = linkedinMatch
    ? `https://linkedin.com/in/${linkedinMatch[1]}`
    : null;

  const githubMatch = text.match(REGEX_PATTERNS.github);
  const github = githubMatch ? `https://github.com/${githubMatch[1]}` : null;

  const websiteMatch = text.match(REGEX_PATTERNS.website);
  const website = websiteMatch ? websiteMatch[1].trim() : null;
  const twitterMatch = text.match(REGEX_PATTERNS.twitter);
  const twitter = twitterMatch
    ? `https://twitter.com/${twitterMatch[1]}`
    : null;

  const locationLine = lines.find((l) =>
    REGEX_PATTERNS.locationKeywords.test(l),
  );
  const locationFallback = text.match(REGEX_PATTERNS.location);
  const location = locationLine
    ? locationLine.replace(/[\|\•]+/g, ",").trim()
    : locationFallback
      ? locationFallback[0].trim()
      : null;

  let name = null;
  const stopAt = Math.min(lines.length, 10);
  for (let i = 0; i < stopAt; i++) {
    const line = lines[i];
    if (!line || line.length < 2 || line.length > 60) continue;
    if (REGEX_PATTERNS.nameSkipPatterns.some((p) => p.test(line))) continue;
    if (REGEX_PATTERNS.validName.test(line)) {
      name = line;
      break;
    }
  }

  let summaryLines = extractSection(text, REGEX_PATTERNS.summaryHeaders);
  if (summaryLines.length === 0) {
    const expLines = extractSection(
      text,
      REGEX_PATTERNS.experience,
      REGEX_PATTERNS.experienceExit,
    );
    summaryLines = expLines.slice(0, 2);
  }

  return {
    name: name || "Unknown",
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    twitter,
    summary: summaryLines.slice(0, 3).join(" ") || null,
  };
};

const extractEducation = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.education);
  return lines.length > 0 ? lines : ["Not detected"];
};

const extractExperience = (text) => {
  const lines = extractSection(
    text,
    REGEX_PATTERNS.experience,
    REGEX_PATTERNS.experienceExit,
  );
  return lines.length > 0 ? lines : ["Not detected"];
};

const extractProjects = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.projects);
  return lines.length > 0 ? lines : ["Not detected"];
};

const extractCertifications = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.certifications);
  return lines.length > 0 ? lines : ["Not detected"];
};

const extractLanguages = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.languages);
  return lines.length > 0 ? lines : ["Not detected"];
};

const SKILL_ALIASES = {
  "\\bexcel\\b": "microsoft excel",
  "\\bword\\b(?! processing)": "microsoft word",
  "\\bpowerpoint\\b": "microsoft powerpoint",
  "\\bms excel\\b": "microsoft excel",
  "\\bms word\\b": "microsoft word",
  "\\bms powerpoint\\b": "microsoft powerpoint",
  "\\bpbi\\b": "power bi",
  "\\bgit\\b": "git",
  "\\bnode\\b": "node.js",
  "\\bnodejs\\b": "node.js",
  "\\breact\\.?js\\b": "react",
};

// const SKILL_LIST = [
//   "communication",
//   "teamwork",
//   "leadership",
//   "problem solving",
//   "critical thinking",
//   "time management",
//   "adaptability",
//   "decision making",
//   "analytical thinking",
//   "creativity",
//   "collaboration",
//   "negotiation",
//   "conflict resolution",
//   "emotional intelligence",

//   "microsoft excel",
//   "microsoft word",
//   "microsoft powerpoint",
//   "microsoft project",
//   "data analysis",
//   "reporting",
//   "documentation",
//   "presentation skills",

//   "project management",
//   "business analysis",
//   "stakeholder management",
//   "strategic planning",
//   "operations management",
//   "process improvement",
//   "risk management",
//   "agile",
//   "scrum",
//   "product management",
//   "forecasting",
//   "vendor management",
//   "contract negotiation",

//   "digital marketing",
//   "seo",
//   "social media marketing",
//   "content marketing",
//   "lead generation",
//   "crm",
//   "sales strategy",
//   "brand management",
//   "copywriting",

//   "financial analysis",
//   "budgeting",
//   "accounting",
//   "taxation",
//   "auditing",
//   "cost management",
//   "tally",
//   "gst",

//   "supply chain management",
//   "inventory management",
//   "logistics",
//   "procurement",

//   "recruitment",
//   "talent acquisition",
//   "employee engagement",
//   "performance management",
//   "hr operations",
//   "payroll",

//   "research",
//   "data interpretation",
//   "quality assurance",
//   "quality control",
//   "compliance",
//   "testing",

//   "erp",
//   "sap",
//   "sas",
//   "salesforce",
//   "zoho",
//   "power bi",
//   "tableau",
//   "jira",
//   "trello",
//   "asana",
//   "notion",
//   "figma",
//   "canva",

//   "javascript",
//   "python",
//   "java",
//   "c++",
//   "c#",
//   "typescript",
//   "react",
//   "node.js",
//   "express",
//   "mongodb",
//   "sql",
//   "mysql",
//   "postgresql",
//   "firebase",
//   "rest api",
//   "graphql",
//   "git",
//   "docker",
//   "kubernetes",
//   "aws",
//   "azure",
//   "gcp",
//   "cloud computing",
//   "linux",
//   "html",
//   "css",
//   "tailwind",
//   "bootstrap",
//   "next.js",
//   "vue.js",

//   "artificial intelligence",
//   "machine learning",
//   "deep learning",
//   "nlp",
//   "computer vision",
//   "data science",
//   "automation",
//   "cybersecurity",
//   "blockchain",
//   "iot",

//   "kpi",
//   "roi",
//   "process optimization",
//   "client handling",
//   "customer satisfaction",
//   "business growth",
// ];

const extractSkills = (text, jobDescription = "") => {
  const resumeLower = text.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const matched = new Map();

  for (const skill of SKILL_LIST) {
    if (resumeLower.includes(skill)) {
      matched.set(skill, jdLower.includes(skill) ? "high" : "medium");
    }
  }

  for (const [aliasPattern, canonicalSkill] of Object.entries(SKILL_ALIASES)) {
    const re = new RegExp(aliasPattern, "i");
    if (re.test(text) && !matched.has(canonicalSkill)) {
      matched.set(
        canonicalSkill,
        jdLower.includes(canonicalSkill) ? "high" : "medium",
      );
    }
  }

  return Array.from(matched.entries()).map(([skill, match]) => ({
    skill,
    match,
  }));
};

const stem = (word) => {
  if (word.length <= 4) return word;
  if (word.endsWith("ing")) return word.slice(0, -3);
  if (word.endsWith("tion")) return word.slice(0, -3);
  if (word.endsWith("ness")) return word.slice(0, -4);
  if (word.endsWith("ment")) return word.slice(0, -4);
  if (word.endsWith("able") || word.endsWith("ible")) return word.slice(0, -4);
  if (word.endsWith("ated")) return word.slice(0, -2);
  if (word.endsWith("ed")) return word.slice(0, -2);
  if (word.endsWith("er")) return word.slice(0, -2);
  if (word.endsWith("ly")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
};

const tokenize = (text) =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && isNaN(w))
    .map(stem);

const calculateAtsScore = (resumeText, jobDescription) => {
  if (!jobDescription || jobDescription.trim().length === 0) {
    return { score: 0, matched: 0, total: 0, matchedKeywords: [] };
  }

  const resumeTokens = new Set(tokenize(resumeText));
  const jdTokens = tokenize(jobDescription);
  const uniqueJdTokens = [...new Set(jdTokens)];

  const matchedKeywords = [];
  let matchCount = 0;
  for (const token of uniqueJdTokens) {
    if (resumeTokens.has(token)) {
      matchCount++;
      matchedKeywords.push(token);
    }
  }

  const score =
    uniqueJdTokens.length > 0
      ? Math.round((matchCount / uniqueJdTokens.length) * 100)
      : 0;

  return {
    score,
    matched: matchCount,
    total: uniqueJdTokens.length,
    matchedKeywords,
  };
};

const analyzeResume = async (req, res) => {
  try {
    const { jobDescription = "" } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: missing user ID" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Resume file required (PDF or DOCX)" });
    }

    const resumeText = await extractText(req.file);
    if (!resumeText) {
      return res
        .status(400)
        .json({ error: "Could not extract text from resume" });
    }

    const basicInfo = extractBasicInfo(resumeText);
    const education = extractEducation(resumeText);
    const experience = extractExperience(resumeText);
    const projects = extractProjects(resumeText);
    const certifications = extractCertifications(resumeText);
    const languages = extractLanguages(resumeText);
    const skillsData = extractSkills(resumeText, jobDescription);
    const skills = skillsData.map((s) => s.skill);
    const scoreData = calculateAtsScore(resumeText, jobDescription);

    let candidate = await Candidate.findOne({ user_id: userId }).populate({
      path: "user_id",
      select: "firstName lastName",
    });

    const candidatePayload = {
      phone: basicInfo.phone ?? "+91 -",
      location: basicInfo.location ?? "-",
      email: basicInfo.email ?? "",
      linkedin: basicInfo.linkedin ?? null,
      github: basicInfo.github ?? null,
      website: basicInfo.website ?? null,
      twitter: basicInfo.twitter ?? null,
      summary: basicInfo.summary ?? null,
      skills,
      education,
      experience,
      projects,
      certifications,
      languages,
      resumeUrl: `uploads/${req.file.filename}`,
      resumeText,
      ats_score: scoreData.score,
    };

    if (!candidate) {
      candidate = await Candidate.create({
        user_id: userId,
        ...candidatePayload,
      });
    } else {
      Object.assign(candidate, candidatePayload);
      await candidate.save();
    }

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        extractedInfo: basicInfo,
        atsScore: scoreData,
        skillsBreakdown: skillsData,
        sectionsDetected: {
          education: education.length,
          experience: experience.length,
          projects: projects.length,
          certifications: certifications.length,
          languages: languages.length,
        },
        candidate,
      },
    });
  } catch (err) {
    console.error("analyzeResume error:", err.message, err.stack);

    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate email entry detected" });
    }

    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};

export default analyzeResume;
