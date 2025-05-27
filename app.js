import express from "express";
import fs from "fs";
import path from "path";
import srri from "qr-image";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("main"); // just the filename, since views folder is set
});

app.post("/s", (req, res) => {
  const inputText = req.body.r;
  const qrImagePath = path.join(__dirname, "public", "j.jpg");

  const qr_svg = srri.image(inputText, { type: "jpg" });

  // Create a write stream and wait for finish event
  const writeStream = fs.createWriteStream(qrImagePath);
  qr_svg.pipe(writeStream);

  writeStream.on("finish", () => {
    res.render("index"); // You can pass data if needed
  });

  writeStream.on("error", (err) => {
    console.error("Error writing QR code image:", err);
    res.status(500).send("Internal Server Error");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
