import Auth from "../components/Auth";
import { createUser, signInUser } from "../supabase/auth";
import { useState } from "react";

type AuthType = "sign-in" | "create";

const AuthPage = () => {
  const [authType, setAuthType] = useState<AuthType>("sign-in");

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await signInUser(email, password);
    console.log("sign in");
    console.log("data: ", data);
    console.log("error: ", error);
  };

  const handleCreateUser = async (email: string, password: string) => {
    const { data, error } = await createUser(email, password);
    console.log("create");
    console.log("data: ", data);
    console.log("error: ", error);
  };

  return (
    <div>
      <h1>Welcome to Legal-aid</h1>
      {authType === "sign-in" ? (
        <div>
          <Auth
            title="Login to your account"
            btnText="Sign In"
            btnFn={handleSignIn}
          />
          <p>
            if you do not have an account{" "}
            <span onClick={() => setAuthType("create")}>create one now.</span>
          </p>
        </div>
      ) : (
        <div>
          <Auth
            title="Create an account"
            btnText="Create"
            btnFn={handleCreateUser}
          />
          <p>
            if you already have an account{" "}
            <span onClick={() => setAuthType("sign-in")}>sign in.</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
