//external imports
import { Toaster } from "sonner";
import { Outlet } from "react-router";

const App = () => {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
};

export default App;
