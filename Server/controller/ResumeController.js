import fs from "fs";
import { createRequire } from "module";
import Candidate from "../model/Candidate.js";

const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────
// PRE-COMPILED REGEX PATTERNS (for performance)
// ─────────────────────────────────────────────
const REGEX_PATTERNS = {
  email: /\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}\b/i,
  phone:
    /(?:\+?\d{1,4}[\s.\-]?)?(?:\(?\d{1,4}\)?[\s.\-]?)?\d{3,5}[\s.\-]?\d{3,5}[\s.\-]?\d{3,5}/,
  linkedin: /(?:linkedin\.com\/in\/|linkedin:\s*)([A-Za-z0-9\-_%]+)/i,
  github: /(?:github\.com\/|github:\s*)([A-Za-z0-9\-_%]+)/i,
  website:
    /(?:portfolio|website|site|web)[\s:\-]*([https://www\.][A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/i,
  twitter: /(?:twitter\.com\/|twitter:\s*@?|x\.com\/)([A-Za-z0-9_]+)/i,
  location: /\b([A-Za-z\s]+),\s*([A-Za-z\s]+)(?:,\s*([A-Za-z\s]+))?\b/,
  locationKeywords:
    /ahmedabad|surat|baroda|vadodara|rajkot|gandhinagar|mumbai|pune|delhi|bangalore|bengaluru|hyderabad|chennai|kolkata|jaipur|india|gujarat|maharashtra|karnataka|tamil\s*nadu|west\s*bengal/i,
  nameSkipPatterns: [
    /@/,
    /\d{5,}/,
    /http|www\.|linkedin|github/i,
    /resume|cv|curriculum/i,
  ],
  validName: /^[A-Za-z]+([\s'\-][A-Za-z]+){0,4}$/,
  summaryHeaders: [
    /summary/i,
    /objective/i,
    /profile/i,
    /about\s*me/i,
    /overview/i,
  ],
  education: [
    /^education$/i,
    /academic\s*(background|qualifications?)?/i,
    /^qualifications?$/i,
    /^degrees?$/i,
  ],
  experience: [
    /work\s*experience/i,
    /^experience$/i,
    /employment(\s*history)?/i,
    /professional\s*experience/i,
  ],
  experienceExit: /education|skills|projects|certifications|references|awards/i,
  projects: [/^projects?$/i, /personal\s*projects?/i, /academic\s*projects?/i],
  certifications: [
    /certifications?/i,
    /licenses?\s*&?\s*certifications?/i,
    /courses?/i,
    /training/i,
  ],
  languages: [/^languages?$/i, /language\s*skills?/i],
  defaultSectionExit:
    /experience|employment|work\s*history|skills|projects|certifications|education|references|awards|achievements/i,
};

// ─────────────────────────────────────────────
// PDF Parser
// ─────────────────────────────────────────────
const getPdfParser = async () => {
  const pdfModule = require("pdf-parse");
  return pdfModule.default || pdfModule;
};

// ─────────────────────────────────────────────
// Extract Raw Text from File
// ─────────────────────────────────────────────
const extractText = async (file) => {
  if (!file) throw new Error("No file uploaded");

  const filePath = file.path;
  const ext = file.originalname.split(".").pop().toLowerCase();

  let text = "";

  if (ext === "pdf") {
    const pdfParse = await getPdfParser();
    const data = await pdfParse(fs.readFileSync(filePath));
    text = data.text;
  } else if (ext === "docx") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    text = result.value;
  } else {
    throw new Error("Unsupported file format; only PDF and DOCX supported");
  }

  return text.trim();
};

// ─────────────────────────────────────────────
// Extract Basic Info (Name, Email, Phone, etc.)
// ─────────────────────────────────────────────
const extractBasicInfo = (text) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const lowerText = text.toLowerCase();

  // Extract email
  const emailMatch = text.match(REGEX_PATTERNS.email);
  const email = emailMatch ? emailMatch[0].toLowerCase() : null;

  // Extract phone
  const phoneMatch = text.match(REGEX_PATTERNS.phone);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, " ").trim() : null;

  // Extract LinkedIn
  const linkedinMatch = text.match(REGEX_PATTERNS.linkedin);
  const linkedin = linkedinMatch
    ? `https://linkedin.com/in/${linkedinMatch[1]}`
    : null;

  // Extract GitHub
  const githubMatch = text.match(REGEX_PATTERNS.github);
  const github = githubMatch ? `https://github.com/${githubMatch[1]}` : null;

  // Extract Portfolio/Website
  const websiteMatch = text.match(REGEX_PATTERNS.website);
  const website = websiteMatch ? websiteMatch[1].trim() : null;

  // Extract Twitter/X
  const twitterMatch = text.match(REGEX_PATTERNS.twitter);
  const twitter = twitterMatch
    ? `https://twitter.com/${twitterMatch[1]}`
    : null;

  // Extract Location
  const locationMatch = text.match(REGEX_PATTERNS.location);
  const locationLine = lines.find((l) =>
    REGEX_PATTERNS.locationKeywords.test(l),
  );
  const location = locationLine
    ? locationLine.replace(/[\|\•,]+/g, ",").trim()
    : locationMatch
      ? locationMatch[0].trim()
      : null;

  // Extract Name (first 10 lines, heuristic: short alphabetic line before email/phone)
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

  // Extract Summary
  const summarySection = extractSection(text, REGEX_PATTERNS.summaryHeaders);

  return {
    name: name || "Unknown",
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    twitter,
    summary: summarySection.slice(0, 3).join(" ") || null,
  };
};

// ─────────────────────────────────────────────
// Generic Section Extractor (reusable)
// ─────────────────────────────────────────────
const extractSection = (text, headerPatterns, exitPatterns = null) => {
  const lines = text.split("\n").map((l) => l.trim());
  const defaultExit = exitPatterns || REGEX_PATTERNS.defaultSectionExit;

  let inSection = false;
  const collected = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (headerPatterns.some((re) => re.test(line))) {
      inSection = true;
      continue;
    }
    if (inSection && defaultExit.test(line)) break;
    if (inSection && line.length > 5) collected.push(line);
  }

  return collected;
};

// ─────────────────────────────────────────────
// Extract Education
// ─────────────────────────────────────────────
const extractEducation = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.education);
  return lines.length > 0 ? lines : ["Not detected"];
};

// ─────────────────────────────────────────────
// Extract Work Experience
// ─────────────────────────────────────────────
const extractExperience = (text) => {
  const lines = extractSection(
    text,
    REGEX_PATTERNS.experience,
    REGEX_PATTERNS.experienceExit,
  );
  return lines.length > 0 ? lines : ["Not detected"];
};

// ─────────────────────────────────────────────
// Extract Projects
// ─────────────────────────────────────────────
const extractProjects = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.projects);
  return lines.length > 0 ? lines : ["Not detected"];
};

// ─────────────────────────────────────────────
// Extract Certifications
// ─────────────────────────────────────────────
const extractCertifications = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.certifications);
  return lines.length > 0 ? lines : ["Not detected"];
};

// ─────────────────────────────────────────────
// Extract Languages
// ─────────────────────────────────────────────
const extractLanguages = (text) => {
  const lines = extractSection(text, REGEX_PATTERNS.languages);
  return lines.length > 0 ? lines : ["Not detected"];
};

// ─────────────────────────────────────────────
// Extract Skills (matched + prioritised by JD)
// ─────────────────────────────────────────────
const SKILL_LIST = [
  // Soft Skills
  "communication",
  "teamwork",
  "leadership",
  "problem solving",
  "critical thinking",
  "time management",
  "adaptability",
  "decision making",
  "analytical thinking",
  "creativity",
  "collaboration",
  "negotiation",
  "conflict resolution",
  "emotional intelligence",

  // Office / General
  "microsoft excel",
  "microsoft word",
  "microsoft powerpoint",
  "data analysis",
  "reporting",
  "documentation",
  "presentation skills",

  // Business
  "project management",
  "business analysis",
  "stakeholder management",
  "strategic planning",
  "operations management",
  "process improvement",
  "risk management",
  "agile",
  "scrum",
  "product management",

  // Marketing / Sales
  "digital marketing",
  "seo",
  "social media marketing",
  "content marketing",
  "lead generation",
  "crm",
  "sales strategy",
  "brand management",
  "copywriting",

  // Finance
  "financial analysis",
  "budgeting",
  "accounting",
  "taxation",
  "auditing",
  "cost management",
  "tally",
  "gst",

  // Supply Chain / Ops
  "supply chain management",
  "inventory management",
  "logistics",
  "procurement",
  "vendor management",

  // HR
  "recruitment",
  "talent acquisition",
  "employee engagement",
  "performance management",
  "hr operations",
  "payroll",

  // Research / QA
  "research",
  "data interpretation",
  "quality assurance",
  "quality control",
  "compliance",
  "testing",

  // Tools / Platforms
  "erp",
  "sap",
  "salesforce",
  "zoho",
  "power bi",
  "tableau",
  "jira",
  "trello",
  "asana",
  "notion",
  "figma",
  "canva",

  // Tech
  "javascript",
  "python",
  "java",
  "c++",
  "c#",
  "typescript",
  "react",
  "node.js",
  "express",
  "mongodb",
  "sql",
  "mysql",
  "postgresql",
  "firebase",
  "rest api",
  "graphql",
  "git",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "cloud computing",
  "linux",
  "html",
  "css",
  "tailwind",
  "bootstrap",
  "next.js",
  "vue.js",

  // Advanced Tech
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "nlp",
  "computer vision",
  "data science",
  "automation",
  "cybersecurity",
  "blockchain",
  "iot",

  // KPIs
  "kpi",
  "roi",
  "process optimization",
  "client handling",
  "customer satisfaction",
  "business growth",
];

// Create a Set for O(1) lookup performance
const SKILL_SET = new Set(SKILL_LIST.map((s) => s.toLowerCase()));

const extractSkills = (text, jobDescription = "") => {
  const resumeTextLower = text.toLowerCase();
  const jdTextLower = jobDescription.toLowerCase();

  const matchedSkills = [];
  for (const skill of SKILL_LIST) {
    if (resumeTextLower.includes(skill.toLowerCase())) {
      matchedSkills.push({
        skill,
        match: jdTextLower.includes(skill.toLowerCase()) ? "high" : "medium",
      });
    }
  }
  return matchedSkills;
};

// ─────────────────────────────────────────────
// ATS Score Calculator (optimized)
// ─────────────────────────────────────────────
const calculateAtsScore = (resumeText, jobDescription) => {
  if (!jobDescription || jobDescription.trim().length === 0) {
    return { score: 0, matched: 0, total: 0 };
  }

  // Single pass word extraction with Set for O(1) lookup
  const resumeWords = new Set(
    resumeText.toLowerCase().split(/\W+/).filter(Boolean),
  );
  const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(Boolean);
  const uniqueJdWords = [...new Set(jdWords)];

  let matchCount = 0;
  for (const word of uniqueJdWords) {
    if (resumeWords.has(word)) matchCount++;
  }

  const score =
    uniqueJdWords.length > 0
      ? Math.round((matchCount / uniqueJdWords.length) * 100)
      : 0;

  return { score, matched: matchCount, total: uniqueJdWords.length };
};

export const analyzeResume = async (req, res) => {
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

    // ── 1. Extract Raw Text ──────────────────
    const resumeText = await extractText(req.file);
    if (!resumeText) {
      return res
        .status(400)
        .json({ error: "Could not extract text from resume" });
    }

    // ── 2. Extract All Sections ──────────────
    const basicInfo = extractBasicInfo(resumeText);
    const education = extractEducation(resumeText);
    const experience = extractExperience(resumeText);
    const projects = extractProjects(resumeText);
    const certifications = extractCertifications(resumeText);
    const languages = extractLanguages(resumeText);
    const skillsData = extractSkills(resumeText, jobDescription);
    const skills = skillsData.map((s) => s.skill);
    const scoreData = calculateAtsScore(resumeText, jobDescription);

    // ── 3. Upsert Candidate ──────────────────
    let candidate = await Candidate.findOne({ user_id: userId }).populate({
      path: "user_id",
      select: "firstName lastName",
    });

    const candidatePayload = {
      phone: basicInfo.phone ?? "+91 -",
      location: basicInfo.location ?? "-",
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

    // ── 4. Response ──────────────────────────
    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        extractedInfo: basicInfo, // Full parsed personal details
        atsScore: scoreData, // { score, matched, total }
        skillsBreakdown: skillsData, // [{ skill, match }] for frontend badges
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
