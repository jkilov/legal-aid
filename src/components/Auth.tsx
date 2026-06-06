import { useState } from "react";

interface Props {
  title: string;
  btnText: React.ReactNode;
  btnFn: (email: string, password: string) => void;
}
const Auth = ({ title, btnText, btnFn }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (email: string, password: string) => {
    btnFn(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h3>{title}</h3>
      <label htmlFor="email">Email: </label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button
        type="button"
        onClick={() => {
          handleSubmit(email, password);
        }}
      >
        {btnText}
      </button>
    </div>
  );
};

export default Auth;
