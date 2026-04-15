export const authorizeRecruiter = (req, res, next) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Only recruiters allowed" });
  }

  if (req.user.status !== "approved") {
    return res.status(403).json({
      message: "Recruiter not approved yet",
    });
  }

  next();
};
