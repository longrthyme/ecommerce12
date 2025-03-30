import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      navigate("/auth")
    //   return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Left: Logo & Menu */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold text-blue-600">
          LOGO
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Trang Chủ
          </Link>
          <Link to="/san-pham" className="text-gray-700 hover:text-blue-600">
            Sản Phẩm
          </Link>
        </nav>
      </div>

      {/* Right: User Dropdown */}
      <div className="relative">
        <button
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User size={24} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Thông Tin Chi Tiết
            </Link>
            <button
              onClick={() => logout()}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
