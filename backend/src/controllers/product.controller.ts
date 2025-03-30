import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { cassandraClient } from "../config/db";

export const addProduct = async (req: Request, res: Response) => {
  try {
    console.log("Received files:", req.files);

    const { seller_id, title, description, price, stock, status, images } =
      req.body;

    let imagePaths = null;

    if (req.files) {
      // Lấy danh sách đường dẫn ảnh
      imagePaths = (req.files as Express.Multer.File[]).map(
        (file) => file.path
      );

      console.log("path ", imagePaths);
    }

    console.log("data add", req.body);
// Chuyển đổi kiểu dữ liệu chính xác
const parsedPrice = parseFloat(price);  // DECIMAL
const parsedStock = parseInt(stock, 10); // INT (4 byte)

console.log("value price ", parsedPrice, parsedStock);

    const product_id = uuidv4();

    const query = `
      INSERT INTO seller_products (seller_id, product_id, name, description, price, stock, status, images, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()));
    `;

    await cassandraClient.execute(query, [
      seller_id,
      product_id,
      title,
      description,
      parsedPrice,
      parsedStock,
      status,
      imagePaths,
    ], { prepare: true });

    res
      .status(201)
      .json({ message: "Product added successfully!", product_id });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
