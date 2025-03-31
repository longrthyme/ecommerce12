import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("E-commerce Backend API is running!");
});
app.use("/api/auth", authRoutes);

app.use("/api/product/", productRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/cart/", cartRoutes);

export default app;
