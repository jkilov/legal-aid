import { signOutUser } from "../lib/auth";
import { useNavigate } from "react-router";
import "tailwindcss";

const NavBar = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
  };

  const handleNavigate = (path: string): void => {
    navigate(`/${path}`);
  };

  return (
    <div className="border-b border-solid">
      <li className="flex flex-row justify-evenly m-5">
        <ul onClick={() => handleNavigate("search")}>Document Search</ul>
        <ul onClick={() => handleNavigate("library")}>Document Library</ul>
        <ul onClick={handleSignOut}>Sign Out</ul>
      </li>
    </div>
  );
};

export default NavBar;
