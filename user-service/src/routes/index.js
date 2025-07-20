import express from "express";
import authors from "./authorRoutes.js";
import users from "./userRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => res.status(200).send("User Service OK"));

  app.use(express.json());

  app.use("/authors", authors);
  app.use("/users", users);
};

export default routes;
