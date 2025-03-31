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

export const getProductsDetail =  async (req: Request, res: Response) => {
  const { product_id } = req.params; // Retrieve product_id from URL parameters
  
  // Define the query to fetch product details by product_id
  const query = `
    SELECT * FROM seller_products WHERE product_id = ? ALLOW FILTERING;
  `;

  try {
    // Execute the query with the product_id
    const result = await cassandraClient.execute(query, [product_id], { prepare: true });

    console.log("product detail res ", result);
    

    // If no product is found, return a 404 response
    if (result.rowLength === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("product detail res ", result.rows[0]);
    // Return the product data
    res.status(200).json(result.rows[0]);
    
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts =  async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;

    // Convert to numbers with defaults
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const offset = (pageNumber - 1) * pageSize;

    const query = `
      SELECT * FROM seller_products 
      LIMIT ?
      ALLOW FILTERING;
    `;

    const result = await cassandraClient.execute(query, [pageSize + offset], { prepare: true });

    // Simulate pagination by slicing (since Cassandra doesn’t support OFFSET)
    const products = result.rows.slice(offset, offset + pageSize);

    res.json({
      page: pageNumber,
      limit: pageSize,
      total: result.rows.length, // This is not efficient for large datasets
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};