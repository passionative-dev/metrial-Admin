import express from "express";
import { wrapAsync } from "../helpers.js";
import * as CountryService from "../services/Country.js";

const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    res.json(await CountryService.getCountry());
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
