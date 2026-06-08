import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

const ProtectedLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
