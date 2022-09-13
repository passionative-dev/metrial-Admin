import express from "express";
import path from "path";
import * as csv from "fast-csv";
import formidable from 'formidable';
import { wrapAsync } from "../helpers.js";
import db from "../db/models/index.js";
import fs from "fs";
import { PythonShell } from "python-shell";
import moment from "moment";
import * as AnalysisonService from "../services/analysis.js";
import { send } from "process";
import multer from "multer";
const __dirname = path.resolve(path.dirname(""));
const configFilePath = path.join(__dirname, "/src/config/parameters_analysis.json");

const router = express.Router();
const pythoPath = "D:\\Work\\singapore\\flatlogic-main\\flatlogic-main\\repos\\flatlogic\\nodejs-backend\\public\\supervised_machine_learning\\"

var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, path.join(__dirname, '/uploads/'));    
  }, 
  filename: function (req, file, cb) { 
     cb(null , 'ddd');   
  }
});
var upload = multer({ storage: storage })

router.get(
  "/",
  wrapAsync(async (req, res) => {
    var data = await db.Analysis.findAll();
    res.json(data)
  })
);  

router.get("/files", async (req, res) => {
  res.json(await db.UploadAnalysis.findAll());
  console.log()
});

router.delete("/files/:id", async (req, res) => {
  const file = await db.UploadAnalysis.findByPk(req.params.id);

  const rootpath = __dirname + "/public/supervised_machine_learning";
  const filepath = rootpath + `/data/${file.directory}/${file.filename}`;

  fs.unlink(filepath, async (err) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ success: false, message: "Unknown error occured" });
    }
    await db.Analysis.destroy({ where: { parameter: file.directory, filename: file.filename } });
    await db.UploadAnalysis.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      message: "File was deleted successfully.",
    });
  });
});

router.post(
  "/chartData",
  wrapAsync(async (req, res) => {
    const __dirname = path.resolve(path.dirname(""));
    const rootpath = __dirname + "\\public\\supervised_machine_learning";
    const newpath = rootpath + "\\data\\UploadAnalysis\\";
    const ops = req.body.form;
    const arr = req.body.fileName.split(", ");
    const fileName = [];
    for(var i = 1;i<arr.length;i++){
      fileName.push(arr[i]);
    }
    let resData = res;
    let options = {
      args: [rootpath, fileName, ops.catId, ops.param1, ops.param2, ops.param3, ops.param4, ops.param5, ops.param6, ops.param7],
    };
    console.log(ops, 'asdfasdfas')
    if(ops.csvformat !=2){
      PythonShell.run(pythoPath + "format1.py", options, async function (err, res) {
        if (err) {
          console.log("err", err);
          return resData.status(200).json({ status: 1, code: 200 });
        } else {
          var json = JSON.parse(res);
          return resData.status(200).json({ status: 2, data: json, code: 200 });
        }
      });
    }else{
      PythonShell.run(pythoPath + "format2.py", options, async function (err, data) {
        if (err) {
          console.log("err", err);
          return resData.status(200).json({ status: 1, code: 200 });
        } else {
          var json = JSON.parse(data)
          console.log('ddddddddddddddddddddddddddddddd');
          return resData.status(200).json({ status: 2, data: json, code: 200 });
        }
      });
    }
  })
);

router.post(
  "/finalResult",
  wrapAsync(async (req, res) => {
    const __dirname = path.resolve(path.dirname(""));
    const rootpath = __dirname + "\\public\\supervised_machine_learning";
    const newpath = rootpath + "\\data\\UploadAnalysis\\";
    const ops = req.body.form;
    const directory = req.body.directory;
    const arr = req.body.fileName.split(", ");
    const fileName = [];
    for(var i = 1;i<arr.length;i++){
      fileName.push(arr[i]);
    }

    console.log(fileName)
    let options = {
      args: [rootpath, fileName, ops.catId, ops.param1, ops.param2, ops.param3, ops.param4, ops.param5, ops.param6, ops.param7],
    };
    PythonShell.run(pythoPath + "main_analysis_results.py", options, async function (err, pyData) {
      if (err) {
        console.log("err", err);
        return res.status(200).json({ status: 1, code: 200 });
      } else {
        const json = JSON.parse(pyData);
        const saveData = json.results;
        await db.Analysis.destroy({where: { filename: req.body.fileName }})

        for (const list of saveData) {
          db.Operation.create({
            filename: req.body.fileName,
            // product_title: 'sample name',
            ...list,
            param1: ops.param1,
            param2: ops.param2,
            param3: ops.param3,
          });
        }
        res.json(saveData);
      }
    });
  })
);

router.post(
  "/uploads", 
  wrapAsync(async (req, res) => {
    const __dirname = path.resolve(path.dirname(""));
    const rootpath = __dirname + "/public/supervised_machine_learning";
    const newpath = rootpath + "/data/" + 'UploadAnalysis' + "/" + req.body.directory + "/";
    if (!fs.existsSync(newpath)){
      fs.mkdir(newpath, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
      });
    }
    const file = req.files.file;
    const ops = JSON.parse(req.body.operation);

    console.log(file)
    const filteredfile = `filtered-${moment().format("YYYYMMDD_hhmmss.[csv]")}`;
    file.mv(`${newpath}${filteredfile}`, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).send({ message: "File Upload failed." });
      }
      let options = {
        mode: "text",
        pythonOptions: ["-u"],
        scriptPath: rootpath,
        args: [req.body.directory, file.name, ops.catId, ops.param1, ops.param2, ops.param3, ops.param4, ops.param5, ops.param6, ops.param7],
      };
      PythonShell.run("main.py", options, async function (err, result) {
        if (err) {
          console.log("err", err);
          return res.status(200).json({ status: 1, code: 200 });
        } else {
          await db.UploadFile.create({
            directory: req.body.directory,
            filename: file.name,
            ...ops,
          });
          var filename = file.name;
          const json = JSON.parse(result[0]);
          for (const list of json.results) {
            await AnalysisonService.createAnalysis({
              parameter: req.body.directory,
              filename,
              ...list,
            });
          }
        }
      });
      let stream = fs
        .createReadStream(`${newpath}${filteredfile}`)
        .pipe(csv.parse({ headers: true }))
        // pipe the parsed input into a csv formatter
        .pipe(csv.format({ headers: true }))
        // pipe the parsed input into a csv formatter
        // Using the transform function from the formatting stream
        console.log('finish');
        
        return res.json({status: 3});
    }); 
  })
);
router.post(
  "/upload", (req, res) => {
    console.log(req.body.fileRows)
    const saveData = JSON.parse(req.body.fileRows);
    // const op = JSON.parse(req.body.form);
    db.UploadAnalysis.create({
      directory: saveData[0].Drectory,
      filename: saveData[0].Filename,
    })

    return res.json({status: 3});
  })
router
  .route("/config").get(function (req, res, next) {
    fs.readFile(configFilePath, "utf8", (err, jsonStr) => {
      if (err) {
        console.log(err);
        return res.status(404).json({});
      }
      res.json(JSON.parse(jsonStr));
    });
  })
router.route("/saveOption").post(function (req, res, next) {
  const jsonString = JSON.stringify(req.body);
  console.log(req.body)
  fs.writeFile(configFilePath, jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        res.json({ message: "File was saved successfully." })
    }
  })
  console.log('asdfasd')
});

export default router;
