import express from "express";
import db from "../db/models/index.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json(await db.Brand.findAll());
});

router.post("/", async (req, res, next) => {
  res.json(
    await db.Brand.create({
      ...req.body,
    })
  );
});

router.put("/:id", async (req, res, next) => {
  const [, model] = await db.Brand.update(req.body, {
    where: { id: req.params.id },
    returning: true,
    plain: true,
  });
  res.json(model.dataValues);
});

router.delete("/:id", async (req, res, next) => {
  db.Brand.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
