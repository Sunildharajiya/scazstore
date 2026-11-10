import { useState } from "react";
import { Link } from "react-router-dom";

export const AuthPage = ({ mode = "login" }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(
      "Demo only: Authentication is not connected to a backend yet."
    );
  };

  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-gray-50 px-4 py-12">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-green-950">
            Scaz<span className="text-green-600">Store</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isSignup
              ? "Create your ScazStore account"
              : "Welcome back! log in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {isSignup && (
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                autoComplete="name"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              minLength={8}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />

            <label className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show password
            </label>
          </div>

          {isSignup && (
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>
          )}

          {message && (
            <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 transition"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-green-700">
                Login
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-green-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-green-700">
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
};

export const LoginPage = () => <AuthPage mode="login" />;

export const SignupPage = () => <AuthPage mode="signup" />;