import express from "express";
import posts from "./postRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => res.status(200).send("Post Service OK"));

  app.use(express.json());

  app.use("/posts", posts);
};

export default routes;
