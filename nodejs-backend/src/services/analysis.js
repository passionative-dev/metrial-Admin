import db from "../db/models/index.js";

export async function createAnalysis(body) {
  return await db.Analysis.create({
    ...body,
  });
}

export async function getAnalysis() {
  return await db.Analysis.findAll();
}
