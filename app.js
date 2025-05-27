import express from "express";
import fs from "fs";
import path from "path";
import srri from "qr-image";
import { fileURLToPath } from "url";

const app = express();

// Support __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("main");
});

app.post("/s", (req, res) => {
  const inputText = req.body.r?.trim();

  if (!inputText) {
    return res
      .status(400)
      .send("Please enter some text to generate a QR code.");
  }

  const qrImagePath = path.join(__dirname, "public", "j.jpg");

  try {
    const qr_svg = srri.image(inputText, { type: "jpg" });
    const writeStream = fs.createWriteStream(qrImagePath);

    qr_svg.pipe(writeStream);

    writeStream.on("finish", () => {
      res.render("index");
    });

    writeStream.on("error", (err) => {
      console.error("Error writing QR code image:", err);
      res.status(500).send("Internal Server Error");
    });
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("QR generation failed");
  }
});

// Dynamic port for Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
