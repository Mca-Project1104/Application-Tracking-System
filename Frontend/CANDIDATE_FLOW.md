# Candidate User Flow and Functionality

This document explains the candidate-side flow for the ATS Web App in `Frontend/`.
It covers the candidate user journey, the main pages and components, and how data flows through the frontend.

## 1. Overview

The candidate side is built with React and React Router. Candidate users can:
- register and verify their email
- log in and be directed to the candidate dashboard
- view resume score and recommended jobs
- edit profile information and profile image
- upload a resume for ATS analysis
- view application history and application detail pages

Key files:
- `src/App.jsx`
- `src/context/AppProvider.jsx`
- `src/Pages/candidate/CandidateDashboard.jsx`
- `src/Pages/candidate/CandidateProfile.jsx`
- `src/Pages/candidate/ResumeAnalyzer.jsx`
- `src/Pages/candidate/HistoryApplication.jsx`
- `src/Pages/candidate/ApplicationDetail.jsx`
- `src/Pages/Login.jsx`
- `src/Pages/Register.jsx`

## 2. Authentication and Routing

### Login flow

`src/Pages/Login.jsx` handles candidate login.
- User enters `email` and `password`.
- On success, backend returns `accessToken` and `user`.
- Candidate tokens are stored in `localStorage.token`.
- User role is stored in `localStorage.userRole`.
- Candidate users are routed to `/candidate`.

### Registration flow

`src/Pages/Register.jsx` handles account creation.
- User enters first name, last name, email, password, confirm password, and account type.
- After successful registration, the user is redirected to `/verify-email`.
- Candidate account type is selected via `accountType`.

### Route protection

Routes are protected in `src/App.jsx`:
- anonymous users can access `/`, `/login`, `/register`, `/verify-email`.
- authenticated users are routed based on role.
- candidate-only pages are available when `userRole === "candidate"`.

## 3. Candidate App Context

`src/context/AppProvider.jsx` provides application-wide data and functions.

### Data loaded for candidate users

- `user`: basic user details stored in localStorage
- `candidate`: candidate profile data from `/api/v1/candidates`
- `applications`: list of candidate applications
- `jobs`: jobs available for the candidate from `/api/v1/jobs/candidate`

### Key actions

- `fetchCandidateData()` loads candidate profile details
- `fetchApplications(candidateId)` loads applications for the current candidate
- `fetchJobs()` loads available jobs for the candidate
- `setCandidate()` updates candidate data in context after resume analysis

This context is the main source for candidate-side UI state.

## 4. Candidate Dashboard

File: `src/Pages/candidate/CandidateDashboard.jsx`

### What it shows

- Welcome header with candidate name
- Resume score widget (from `candidate.ats_score`)
- Profile summary widget
- Recent applications table
- Recommended jobs list

### Actions

- `Improve Resume` button navigates to `/candidate/resume_analyzer`
- `Edit Profile` button navigates to `/candidate/profile`
- Recent applications link navigates to `/candidate/application/:id`
- `View all applications` link navigates to `/candidate/history`

### Data sources

- `candidate` from AppProvider
- `applications` from AppProvider
- `jobs` from AppProvider
- `user` from AppProvider

## 5. Candidate Profile Page

File: `src/Pages/candidate/CandidateProfile.jsx`

### What it allows

- view candidate personal details, skills, education, experience, projects, certifications
- upload or update profile image
- edit candidate bio / personal summary
- download current resume using `candidate.resumeUrl`

### Important behavior

- loads candidate data on mount with `fetchCandidateData()`
- updates via `PUT /api/v1/candidates/update/${candidate._id}`
- supports file upload for profile images with progress tracking
- shows resume download button only if resume exists

## 6. Resume Analyzer

File: `src/Pages/candidate/ResumeAnalyzer.jsx`

### Purpose

This page is where candidates can upload their resume and compare it against a job description.
It sends the resume file plus job description to the backend and receives ATS analysis and scoring.

### Supported file types

- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (`.docx`)
- `.docx`

### Flow

1. Candidate uploads resume by file select or drag-and-drop.
2. Candidate pastes or types a job description.
3. The `analyzeResume()` function creates `FormData` and posts to `/api/v1/resume/analyze`.
4. Backend response updates candidate ATS score and resume analysis details.
5. Candidate context is updated with `setCandidate(candidate)`.

### Result data

- `matchScore`: numeric score shown on screen
- `atsDetail`: optional detailed ATS scoring object
- `analysisData`: parsed resume data from backend
- `resumeText`: extracted resume text

## 7. Application History

File: `src/Pages/candidate/HistoryApplication.jsx`

### What it shows

- a list of all candidate applications
- each application shows job title, company logo, description, skills, status, and created/updated dates
- items are clickable and route to `/candidate/application/:id`

### Data source

- `applications` from AppProvider

## 8. Application Detail Page

File: `src/Pages/candidate/ApplicationDetail.jsx`

### What it shows

- selected application details from `applications.find(item => item._id === id)`
- candidate contact information and resume summary
- job title, company name, application status
- resume match score and progress bar
- resume download link to the stored resume URL

### Key values

- `applicationData.status`
- `applicationData.resume_Analyse.match_score`
- `jobId.title`
- `jobId.companyName`
- `resumeUrl`

## 9. Candidate Side Routes

The candidate user flow uses these routes:

- `/login` — login page
- `/register` — registration page
- `/verify-email` — email verification page
- `/candidate` — candidate dashboard
- `/candidate/profile` — profile editor/view
- `/candidate/resume_analyzer` — resume upload and ATS analysis
- `/candidate/history` — list of all applications
- `/candidate/application/:id` — application details

## 10. Data Persistence and UI Behavior

### Local storage

- `localStorage.token` stores candidate JWT
- `localStorage.userRole` stores `candidate` or `company` or `admin`
- `localStorage.user` stores the current user object
- `localStorage.theme` stores the dark/light mode preference

### Context updates

- After resume analysis, `setCandidate(candidate)` updates candidate data globally.
- `fetchApplications()` is automatically called when candidate data is loaded.
- Dashboard, profile, history, and detail pages all read from the shared context.

## 11. Candidate Flow Summary

1. Candidate registers and verifies email.
2. Candidate logs in; `AppProvider` loads candidate profile and applications.
3. Candidate lands on `/candidate` dashboard.
4. Candidate views resume score, recent applications, recommended jobs.
5. Candidate can edit profile or upload a resume for analysis.
6. Candidate can navigate to application history and view detailed status.
7. Resume analyzer updates candidate ATS score and profile data.

## 12. Notes for Developers

- The candidate experience is driven by `AppProvider.jsx` and the React Router layout in `App.jsx`.
- Most candidate UI screens are lazy-loaded using `React.lazy` to improve performance.
- Candidate pages share the same sidebar/navbar layout as other authenticated users.
- Error and loading states are handled with `Loading` components and toast notifications.

---

This document is intended to give the candidate-side overview, how the flow works, and all major candidate-facing features in the frontend.
