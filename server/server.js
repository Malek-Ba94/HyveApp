import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import orderRoutes from "./routes/orders.js";
import serviceRoutes from "./routes/service.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.ONLINEMDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoutes);

app.listen(7200, () => {
  console.log(`Serveur connecté sur http://localhost:7200`);
});
