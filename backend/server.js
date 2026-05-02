require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => { console.error("MongoDB connection error:", err.message); process.exit(1); });

app.get("/api/verify", async (req, res) => {
  const email = (req.query.email || "").toLowerCase().trim();
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  return res.json({ success: true, student });
});

app.get("/api/certificate", async (req, res) => {
  const email = (req.query.email || "").toLowerCase().trim();
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });

  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0, autoFirstPage: true });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="certificate_${student.name.replace(/\s+/g, "_")}.pdf"`);
  doc.pipe(res);

  const W = doc.page.width;   // 841.89 pt
  const H = doc.page.height;  // 595.28 pt

  // Full JPEG template as background
  doc.image(path.join(__dirname, "certificate_template.jpeg"), 0, 0, { width: W, height: H });

  // ── STUDENT NAME ONLY ─────────────────────────────────────────
  // Positioned on the blank line between "This is to certify that" and
  // "has successfully participated..." — roughly 38% from top
  const fontSize = 28;
  doc.font("Helvetica-Bold").fontSize(fontSize).fillColor("#1a1a1a");
  const nameWidth = doc.widthOfString(student.name);
  doc.text(student.name, (W - nameWidth) / 2, H * 0.375);

  doc.end();
});

app.listen(PORT, () => {
  console.log(`Certificate server running at http://localhost:${PORT}`);
});
