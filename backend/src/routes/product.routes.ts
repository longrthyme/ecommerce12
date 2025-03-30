import { Router } from "express";
import { addProduct } from "../controllers/product.controller";
import upload from "../middlewares/multerConfig";


const router = Router();


router.post("/add", upload.array("images", 5) ,addProduct);


export default router;