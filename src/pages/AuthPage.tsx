import Auth from "../components/Auth";
import { createUser, signInUser, signInGoogle } from "../lib/auth";
import { useState } from "react";
import { useAsyncFunction } from "../hooks/useAsyncFunction";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type AuthType = "sign-in" | "create";

const AuthPage = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<AuthType>("sign-in");

  const { isLoading, run } = useAsyncFunction();

  const handleSignIn = async (email: string, password: string) => {
    try {
      await run(async () => {
        const { data, error } = await signInUser(email, password);

        if (error) {
          toast.error(error.message);
          throw new Error(error.message);
        }

        navigate("/");
        return data;
      });
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Something when wrong"
      );
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await run(async () => await signInGoogle());
      if (error) {
        toast.error("There was an error");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const handleCreateUser = async (email: string, password: string) => {
    await run(async () => {
      const { error } = await createUser(email, password);

      if (error) {
        throw new Error(error.message);
      }
      toast.success("New user created");
      navigate("/");
    });
  };

  return (
    <div>
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
