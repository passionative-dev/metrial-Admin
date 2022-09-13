import express from "express";
import path from "path";
import fs from "fs";
import moment from "moment";
import * as csv from "fast-csv";
import * as ProductService from "../services/products.js";
import { wrapAsync } from "../helpers.js";
import db from "../db/models/index.js";

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Product:
 *        type: object
 *        properties:
 *          img:
 *            type: string
 *          title:
 *            type: string
 *          subtitle:
 *            type: string
 *          price:
 *            type: integer
 *            format: int64
 *          rating:
 *            type: integer
 *            format: int64
 *          description_1:
 *            type: string
 *          description_2:
 *            type: string
 *          code:
 *            type: integer
 *            format: int64
 *          hashtag:
 *            type: string
 *          technology:
 *            type: array
 *            items:
 *              type: string
 *          discount:
 *            type: integer
 *            format: int64
 */

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: The products managing API
 */

/**
 *  @swagger
 *  /api/products:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Get all products
 *      description: Get all products
 *      responses:
 *        200:
 *          description: Products list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Product"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let product = await ProductService.getProducts();
    // let category = await CategoryService.getCategory();
    let result = product.map((item, index) => {
      // let cat = category.filter((item2) => item2.id == item.dataValues.category);
      // console.log(cat)
      let data = item;
      // if (cat.length == 0) data.dataValues = { ...item.dataValues, category: "" };
      // else data.dataValues = { ...item.dataValues, category: cat[0].title };
      return data;
    });
    res.json(result);
  })
);

/**
 * @swagger
 *  /api/products/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Get selected product
 *      description: Get selected product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of product to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected product successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Product not found
 *        500:
 *          description: Some server error
 */

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    res.json(await ProductService.getProduct(req.params.id));
  })
);

/**
 *  @swagger
 *  /api/products/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Update the data of the selected product
 *      description: Update the data of the selected product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new product data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Product"
 *      responses:
 *        200:
 *          description: The product data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Product not found
 *        500:
 *          description: Some server error
 */

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    res.json(await ProductService.updateProduct(req.params.id, req.body));
  })
);

/**
 *  @swagger
 *  /api/products:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Add new product
 *      description: Add new product
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Product"
 *      responses:
 *        200:
 *          description: The product was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */

router.post(
  "/",
  wrapAsync(async (req, res) => {
    res.json(await ProductService.createProduct(req.body));
  })
);

/**
 * @swagger
 *  /api/products/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Delete the selected product
 *      description: Delete the selected product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The product was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Product not found
 *        500:
 *          description: Some server error
 */

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    res.json(await ProductService.deleteProduct(req.params.id));
  })
);

const getCategoryId = async (parent, title) => {
  if (typeof title !== "string") return 0;
  title = title.trim();
  if (title.length === 0) return 0;
  let category = await db.Category.findOne({ where: { parent, title } });
  if (category) {
    return category.id;
  }
  category = await db.Category.create({ parent, title });
  return category.id;
};

const getCountryId = async (parent, title) => {
  if (typeof title !== "string") return 0;
  title = title.trim();
  if (title.length === 0) return 0;
  let country = await db.Country.findOne({ where: { parent, title } });
  if (country) {
    return country.id;
  }
  country = await db.Country.create({ parent, title });
  return country.id;
};

const getBrandId = async (title) => {
  if (typeof title !== "string") return 0;
  title = title.trim();
  if (title.length === 0) return 0;
  let brand = await db.Brand.findOne({ where: { title } });
  if (brand) {
    return brand.id;
  }
  brand = await db.Brand.create({ title });
  return brand.id;
};

router.post("/upload", async (req, res, next) => {
  const __dirname = path.resolve(path.dirname(""));
  const newpath = __dirname + "/public/product/";

  fs.mkdir(newpath, (err) => {
    if (err) {
      console.log("Directory already exist!");
    }
    console.log("Directory created successfully!");
  });

  const file = req.files.file;
  const filename = `product-${moment().format("YYYYMMDD_hhmmss.[csv]")}`;

  if (fs.existsSync(newpath + filename)) {
    res.status(400).json({ message: "File is already exist." });
  }

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: "File Upload failed." });
    }
    const newfilename = `product-result-${moment().format("YYYYMMDD_hhmmss.[csv]")}`;
    const outStream = csv.format({ headers: true });
    outStream.pipe(fs.createWriteStream(`${newpath}${newfilename}`));

    let datas = [];
    fs.createReadStream(`${newpath}${filename}`)
      .pipe(csv.parse({ headers: true }))
      // pipe the parsed input into a csv formatter
      .pipe(csv.format({ headers: true }))
      // Using the transform function from the formatting stream
      .transform((row, next) => {
        datas.push(row);
        next(null);
      })
      .on("data", (row) => {})
      .on("error", (error) => console.error(error))
      .on("end", async () => {
        let total = datas.length,
          success = 0;
        for (let row of datas) {
          let olddata = row;

          row.cat_1 = await getCategoryId(-1, row.cat_1);
          if (row.cat_1 > 0) row.cat_2 = await getCategoryId(row.cat_1, row.cat_2);
          else row.cat_2 = 0;
          if (row.cat_2 > 0) row.cat_3 = await getCategoryId(row.cat_2, row.cat_3);
          else row.cat_3 = 0;

          row.country = await getCountryId(-1, row.country);
          if (row.country > 0) row.state = await getCountryId(row.country, row.state);

          row.brand = await getBrandId(row.brand);
          if (parseInt(row.available)) {
            row.available = !!parseInt(row.available);
          } else row.available = false;

          if (row.title) {
            if (row.title.trim().length === 0) {
              olddata.error = 1;
              olddata.error_message = "Empty Prodcut";
            } else {
              let res = await db.Product.findAll({ where: { title: row.title } });
              if (res.length > 0) {
                olddata.error = 1;
                olddata.error_message = "Duplicate Product Title";
              } else {
                await db.Product.create(row);
                success++;
              }
            }
          } else {
            olddata.error = 1;
            olddata.error_message = "Parameter missing or Column not matches";
          }
          outStream.write(olddata);
        }
        res.json({
          message: "File was uploaded successfully",
          total,
          success,
        });
      });
  });
});

export default router;
