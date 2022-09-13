import db from "../db/models/index.js";

export async function createCategory(body) {
  return await db.Category.create({
    title: body.title,
    parent: body.parent,
  });
}

export async function getCategory() {
  return await db.Category.findAll();
}

export async function editCategory(id, body) {
  const [, model] = await db.Category.update(body, { where: { id }, returning: true, plain: true });
  const { dataValues } = model;
  return dataValues;
}

export async function deletCategory(id, body) {
  await db.Category.destroy({ where: { id } });
}
