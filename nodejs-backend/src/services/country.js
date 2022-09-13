import db from "../db/models/index.js";

export async function createCountry(body) {
  return await db.Country.create({
    title: body.title,
    parent: body.parent,
  });
}

export async function getCountry() {
  return await db.Country.findAll();
}

export async function editCountry(id, body) {
  const [, model] = await db.Country.update(body, { where: { id }, returning: true, plain: true });
  const { dataValues } = model;
  return dataValues;
}

export async function deleteCountry(id) {
  await db.Country.destroy({ where: { id } });
}
