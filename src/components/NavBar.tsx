import { signOutUser } from "../lib/auth";
import { useNavigate } from "react-router";

const NavBar = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
  };
  return (
    <div>
      {" "}
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
};

export default NavBar;
