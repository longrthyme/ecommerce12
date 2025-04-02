import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";

import cookieParser from "cookie-parser";
import path from "path";
import crypto from "crypto";
import qs from "qs";
import { VnpParams } from "./types/VnpParams";

dotenv.config();

const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Use production URL when live
const TMN_CODE = process.env.VNP_TMNCODE || "";
const SECRET_KEY = process.env.VNP_HASHSECRET || "";
const RETURN_URL = "http://localhost:3000/payment-success"; // Change to your frontend success page


const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("E-commerce Backend API is running!");
});

// app.post("/create-payment",  async (req , res) => {
//   try {
//     const { orderId, amount, bankCode } = req.body;

//     let date = new Date();
//     let createDate = date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14); // YYYYMMDDHHMMSS

//     let orderInfo = "Payment for Order " + orderId;
//     let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

//     let vnp_Params:  VnpParams  = {
//       vnp_Version: "2.1.0",
//       vnp_Command: "pay",
//       vnp_TmnCode: TMN_CODE,
//       vnp_Amount: amount * 100, // Convert VND to smallest unit
//       vnp_CurrCode: "VND",
//       vnp_TxnRef: orderId,
//       vnp_OrderInfo: orderInfo,
//       vnp_OrderType: "other",
//       vnp_Locale: "vn",
//       vnp_ReturnUrl: RETURN_URL,
//       vnp_IpAddr: ipAddr,
//       vnp_CreateDate: createDate,
  
//     };

//     if (bankCode) {
//       vnp_Params["vnp_BankCode"] = bankCode;
//     }

//     // Sort params alphabetically
//     vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort()) as VnpParams;

//     let signData = qs.stringify(vnp_Params, { encode: false });
//     let hmac = crypto.createHmac("sha512", SECRET_KEY);
//     let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//     vnp_Params["vnp_SecureHash"] = signed;

//     let paymentUrl = `${VNPAY_URL}?${qs.stringify(vnp_Params, { encode: false })}`;

//     res.json({ paymentUrl });
//   } catch (error) {
//     console.error("VNPAY Error:", error);
//     res.status(500).json({ message: "Payment error" });
//   }
// })


app.use("/api/auth", authRoutes);

app.use("/api/product/", productRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/cart/", cartRoutes);

app.use("/", paymentRoutes);


export default app;
