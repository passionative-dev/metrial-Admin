import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import helmet from "helmet";
import db from "./db/models/index.js";
import cron from "node-cron";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
// import fileupload from "express-fileupload";  

import { exec } from "child_process";

import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/file.js";
import userRoutes from "./routes/user.js";
import analytics from "./routes/analytics.js";
import analysis from "./routes/analysis.js";
import products from "./routes/products.js";
import brandRoutes from "./routes/brand.js";
import extraFieldRoutes from "./routes/extra_field.js";
import operationRoutes from "./routes/operation.js";
import categoryRoutes from "./routes/category.js";
import countryRoutes from "./routes/country.js";

// swagger docs autogenerating options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "User Management Template Backend",
      description:
        "Flatlogic user management backend allows you to create a fully workable data management (CRUD) application. " +
        "You can perform all major operations with users - create, delete and distribute roles. You can either integrate this template into existing applications or create a new one based on it.",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
      {
        url: "https://sing-generator-node.herokuapp.com/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// cors
app.use(cors({ origin: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    referrerPolicy: { policy: "no-referrer-when-downgrade" },
  })
);

import "./auth/auth.js";

app.use(express.static("public"));
app.use(fileupload());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/category", passport.authenticate("jwt", { session: false }), categoryRoutes);
app.use("/api/operation", passport.authenticate("jwt", { session: false }), operationRoutes);
app.use("/api/brand", passport.authenticate("jwt", { session: false }), brandRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/extra_fields", passport.authenticate("jwt", { session: false }), extraFieldRoutes);
app.use("/api/products", passport.authenticate("jwt", { session: false }), products);
app.use("/api/analysis", passport.authenticate("jwt", { session: false }), analysis);
app.use("/api/analytics", passport.authenticate("jwt", { session: false }), analytics);
app.use("/api/users", passport.authenticate("jwt", { session: false }), userRoutes);
app.use("/api/error", passport.authenticate("jwt", { session: false }), countryRoutes);

app.use(express.static("public"));

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

export default app;
