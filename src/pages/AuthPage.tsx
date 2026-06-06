import Auth from "../components/Auth";
import { createUser, signInUser, signOutUser, signInGoogle } from "../lib/auth";
import { useState } from "react";
import { useAsyncFunction } from "../hooks/useAsyncFunction";
import { useNavigate } from "react-router";

type AuthType = "sign-in" | "create";

const AuthPage = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<AuthType>("sign-in");
  const [componentIdentity, setComponentIdentity] = useState(0);

  const { isLoading, run } = useAsyncFunction();

  const handleSignIn = async (email: string, password: string) => {
    try {
      await run(async () => {
        const { data, error } = await signInUser(email, password);

        if (error) throw new Error(error.message);

        console.log("signed in", data);
        navigate("/");
        return data;
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { data, error } = await run(async () => await signInGoogle());
      console.log("Data", data);
      if (error) {
        return "There was an error";
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      console.log(message);
    }
  };

  const handleCreateUser = async (email: string, password: string) => {
    await run(async () => {
      const { data, error } = await createUser(email, password);
      if (error) {
        throw new Error(error.message, error.cause);
      }
      console.log("account created", data);
      return data;
    });
  };

  const handleSignOut = async () => {
    await signOutUser();
    setComponentIdentity((prev) => prev + 1);
  };

  return (
    <div key={componentIdentity}>
      <h1>Welcome to Legal-aid</h1>
      {authType === "sign-in" ? (
        <div>
          <Auth
            title="Login to your account"
            btnText={isLoading ? "Loading" : "Sign In"}
            btnFn={handleSignIn}
          />
          <p>
            if you do not have an account{" "}
            <span onClick={() => setAuthType("create")}>create one now.</span>
          </p>
          <button type="button" onClick={handleSignInWithGoogle}>
            Google
          </button>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      ) : (
        <div>
          <Auth
            title="Create an account"
            btnText={isLoading ? "Loading" : "Create"}
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
