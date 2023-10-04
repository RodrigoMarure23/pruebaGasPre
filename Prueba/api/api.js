import express from "express";
import { router } from "./routes/estacionRoutes.js"
const api = express()
api.use(express.json())
api.get("/status", (req, res) => {
  console.log("ok")
  return res.status(200).json({
    msg: "API FUNCIONANDO 😎"
  })
})
api.use(router)

export default api;