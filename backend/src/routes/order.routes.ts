import { Router } from "express";
import { getOrderList } from "../controllers/oder.controller";

const router = Router();

router.get("/list", getOrderList);

// router.get("/list", getProducts);

export default router;