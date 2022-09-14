import express from "express";
import { wrapAsync } from "../helpers.js";
import * as CountryService from "../services/Country.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve(path.dirname(""));
const logPath = path.join(__dirname, "/public/supervised_machine_learning/error1.log"); 

const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    res.json(await CountryService.getCountry());
  })
);

router.get(
  "/error",
  wrapAsync(async (req, res) => {
    fs.readFile(logPath, "utf8", (err, file) => { //adding "utf-8" only logs a small portion of the .log file, but I was told this might be an async issue.
      console.log(file);
      res.json(file);
    })
  })
);

router.post(
  "/create",
  wrapAsync(async (req, res) => {
    res.json(await CountryService.createCountry(req.body));
  })
);

router.put(
  "/edit/:id",
  wrapAsync(async (req, res) => {
    res.json(await CountryService.editCountry(req.params.id, req.body));
  })
);

export default router;
