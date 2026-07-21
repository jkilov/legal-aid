import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

const ProtectedLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />

      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
