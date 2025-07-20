import express from "express";
import authRoutes from "./authRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => res.status(200).send("Auth Service OK"));

  app.use(express.json());

  app.use("/auth", authRoutes);
};

export default routes;
