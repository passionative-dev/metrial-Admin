import db from "../db/models/index.js";

export async function createOperation(body) {
  return await db.Operation.create({
    ...body,
  });
}

export async function getOperation() {
  return await db.Operation.findAll();
}