import express from "express";
import path from "path";
import * as csv from "fast-csv";
import { wrapAsync } from "../helpers.js";
import db from "../db/models/index.js";
import fs from "fs";
import { PythonShell } from "python-shell";
import moment from "moment";
import * as OperationService from "../services/operation.js";
import { parse } from "csv-parse";
const __dirname = path.resolve(path.dirname(""));
const configFilePath = path.join(__dirname, "/src/config/parameters.json");

const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    res.json(await OperationService.getOperation());
  })
);

router.get("/files", async (req, res) => {
  res.json(await db.UploadFile.findAll());
});

router.delete("/files/:id", async (req, res) => {
  const file = await db.UploadFile.findByPk(req.params.id);

  const rootpath = __dirname + "/public/supervised_machine_learning";
  const filepath = rootpath + `/data/${file.directory}/${file.filename}`;

  fs.unlink(filepath, async (err) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ success: false, message: "Unknown error occured" });
    }
    await db.Operation.destroy({ where: { parameter: file.directory, filename: file.filename } });
    await db.UploadFile.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      message: "File was deleted successfully.",
    });
  });
});

router.post("/filter", async (req, res) => {
  const __dirname = path.resolve(path.dirname(""));
  const rootpath = __dirname + "/public/supervised_machine_learning";
  const newpath = rootpath + "/tmp/";

  const file = req.files.file;
  const filename = `operation-tmp-${moment().format("YYYYMMDD_hhmmss.[csv]")}`;

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: "File Upload failed." });
    }
    let result = [];
    let stream = fs
      .createReadStream(`${newpath}${filename}`)
      .pipe(csv.parse({ headers: true }))
      // pipe the parsed input into a csv formatter
      .pipe(csv.format({ headers: true }))
      // pipe the parsed input into a csv formatter
      // Using the transform function from the formatting stream
      .transform((row, next) => {
        result.push(row); 
        next(null);
      })
      .on("data", (row) => {})
      .on("error", (error) => console.error(error))
      .on("end", () => {
        console.log('finish');
        return res.json({
          rows: result,
        });
        // res.json({
        //   rows: result,
        // });
      });
  });
});

router.post(
  "/upload",
  wrapAsync(async (req, res) => {
    const __dirname = path.resolve(path.dirname(""));
    const rootpath = __dirname + "/public/supervised_machine_learning";
    const newpath = rootpath + "/data/" + req.body.directory + "/";

    const ops = JSON.parse(req.body.operation);

    fs.mkdir(newpath, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("Directory created successfully!");
    });

    const file = req.files.file;
    console.log(file,'upload');
    const filename = file.name;
    const filteredfile = `filtered-${file.name}`;

    const filteredData = req.body.filtered;

    const outStream = csv.format({ headers: true });
    outStream.pipe(fs.createWriteStream(`${newpath}${filteredfile}`));
    /*filteredData.forEach((data) => {
      outStream.write(data);
    });*/
    outStream.end();

    fs.readFile(newpath + filename, (err, data) => {
      if (err == null) {
        res.status(200).json({ status: 10 });
      } else {
        file.mv(`${newpath}${filename}`, (err) => {
          if (err) {
            res.status(200).send({ status: 0, code: 200 });
          } else {
            const filepath = newpath + filename;
            let options = {
              mode: "text",
              pythonOptions: ["-u"],
              scriptPath: rootpath,
              args: [req.body.directory, filepath, ops.catId, ops.param1, ops.param2, ops.param3, ops.param4, ops.param5, ops.param6, ops.param7],
            };
            PythonShell.run("main.py", options, async function (err, result) {
              if (err) {
                console.log("err", err);
                return res.status(200).json({ status: 1, code: 200 });
              } else {
                await db.UploadFile.create({
                  directory: req.body.directory,
                  filename: filename,
                  ...ops,
                });

                const json = JSON.parse(result[0]);
                for (const list of json.results) {
                  await OperationService.createOperation({
                    parameter: req.body.directory,
                    filename,
                    ...list,
                  });
                }
                return res.status(200).json({ status: 2, data: json.results, code: 200 });
              }
            });
          }
        });
      }
    });
  })
);
router
  .route("/config")
  .get(function (req, res, next) {
    fs.readFile(configFilePath, "utf8", (err, jsonStr) => {
      if (err) {
        console.log(err);
        return res.status(404).json({});
      }
      res.json(JSON.parse(jsonStr));
    });
  })
  .post(function (req, res, next) {
    fs.writeFile(configFilePath, JSON.stringify(req.body), (err) => {
      if (err) {
        console.log("Error writing paramter config file.");
        return res.status(500).json({ message: "File save is failed" });
      }
      return res.json({ message: "File was saved successfully." });
    });
  });

export default router;
