import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "../services/axiosInstance";
import { Pencil, PencilIcon, Trash2Icon } from "lucide-react";
import { useLoading } from "../hooks/useLoading";

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { setLoading} = useLoading()

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNumber: number) => {
    try {
        setLoading(true)
      const response =  await axiosInstance.get(
        `/product/list?page=${pageNumber}&limit=${limit}`
      );
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / limit));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleUpdate = (id: string) => {
    console.log("Update Product ID:", id);
    // Add update functionality here
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/product/delete/${id}`);
      setProducts(products.filter((product) => product.product_id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Stock</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id} className="text-center">
                <td className="py-2 px-4 border">{product.name}</td>
                <td className="py-2 px-4 border flex space-x-2 justify-center">
                  {product.images.slice(0, 3).map((img: string, i: number) => (
                    <img key={i} src={`http://localhost:5000/${img}`} alt={`Product ${i}`} className="w-12 h-12 object-cover rounded" />
                  ))}
                </td>
                <td className="py-2 px-4 border">{product.description}</td>
                <td className="py-2 px-4 border">{product.price} VND</td>
                <td className="py-2 px-4 border">{product.stock}</td>
                <td className="py-2 px-4 border">{product.status}</td>
                <td className="py-2 px-4 border flex justify-center space-x-2">
                <button onClick={() => handleUpdate(product.product_id)} className="text-blue-500 hover:text-blue-700">
    <PencilIcon size={20} />
  </button>
  <button onClick={() => handleDelete(product.product_id)} className="text-red-500 hover:text-red-700">
    <Trash2Icon size={20} />
  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {/* Previous Button */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded-full ${
              page === i + 1 ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
