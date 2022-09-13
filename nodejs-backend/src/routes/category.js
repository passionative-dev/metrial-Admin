import express from "express";
import { wrapAsync } from "../helpers.js";
import * as CategoryService from "../services/category.js";

const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    res.json(await CategoryService.getCategory());
  })
);

router.post(
  "/create",
  wrapAsync(async (req, res) => {
    res.json(await CategoryService.createCategory(req.body));
  })
);

router.put(
  "/edit/:id",
  wrapAsync(async (req, res) => {
    res.json(await CategoryService.editCategory(req.params.id, req.body));
  })
);

export default router;
