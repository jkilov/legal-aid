import { Outlet } from "react-router";

//external imports
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
;

export default App;
