import express from "express";
import path from "path";
import { wrapAsync } from "../helpers.js";
const __dirname = path.resolve(path.dirname(""));
const configFilePath = path.join(__dirname, "/src/config/parameters_analysis.json");

const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    res.json("data");
  })
); 
export default router;
