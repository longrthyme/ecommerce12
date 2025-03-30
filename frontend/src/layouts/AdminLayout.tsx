

import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/SideBar";
import { useLoading } from "../hooks/useLoading";
import Spinner from "../components/Spinner";


const AdminLayout = () => {

  const {isLoading} = useLoading()
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Content on the right */}
      <div className="flex-1 p-4">
        {
          isLoading && <Spinner />
        }
        <Outlet /> {/* Render nested admin routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
