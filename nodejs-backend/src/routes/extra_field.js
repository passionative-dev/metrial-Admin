import express from "express";
import db from "../db/models/index.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json(await db.ExtraField.findAll());
});

router.post("/", async (req, res, next) => {
  res.json(
    await db.ExtraField.create({
      ...req.body,
    })
  );
});

router.put("/:id", async (req, res, next) => {
  const [, model] = await db.ExtraField.update(req.body, {
    where: { id: req.params.id },
    returning: true,
    plain: true,
  });
  res.json(model.dataValues);
});

router.delete("/:id", async (req, res, next) => {
  db.ExtraField.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
