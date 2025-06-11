import express from "express";
import fs from "fs";
import path from "path";
import srri from "qr-image";
import { fileURLToPath } from "url";

const a = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
a.set("view engine", "ejs");
a.set("views", path.join(__dirname, "views"));

a.use(express.urlencoded({ extended: true }));
a.use(express.static(path.join(__dirname, "public")));

a.get("/", (req, res) => {
  res.render("main"); // ✅ just the name
});

a.post("/s", (req, res) => {
  const b = req.body["r"];
  const qr_svg = srri.image(b);
  qr_svg.pipe(fs.createWriteStream(path.join(__dirname, "public", "j.jpg")));
  res.render("index"); // ✅ just the name
});

const PORT = process.env.PORT || 3000;
a.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
