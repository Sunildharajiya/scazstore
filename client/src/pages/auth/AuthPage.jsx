
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../../services/authApi";

import { useOutletContext } from "react-router-dom";

const { setIsLoggedIn } = useOutletContext();

export const AuthPage = ({ mode = "login" }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    mobile: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    
    if (loading) return;

    // Validate password confirmation
    if (isSignup && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // Create a new customer account
        const result = await signup({
          firstName: form.firstName.trim(),
          LastName: form.lastName.trim(),
          userName: form.userName.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          password: form.password,
          role: "customer",
        });

        setMessage(
          result.message || "Account created successfully. You can now log in."
        );

        setMessageType("success");

        // Clear signup form
        setForm({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          mobile: "",
          identifier: "",
          password: "",
          confirmPassword: "",
        });

      } else {
        // Authenticate existing customer
        const result = await login({
          identifier: form.identifier.trim(),
          password: form.password,
        });

        // Save access token
        localStorage.setItem("RefToken", result.token);

        setIsLoggedIn(true);

        setMessage("Login successful!");
        setMessageType("success");

        // Redirect to homepage
        navigate("/");
        
      }

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");

    } finally {
      setLoading(false);
    }
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
              : "Welcome back! Log in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Signup Fields */}
          {isSignup && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Username
                </label>

                <input
                  type="text"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="@username"
                  pattern="@[A-Za-z0-9_]+"
                  title="Username must start with @ and contain only letters, numbers or underscores."
                  required
                  autoComplete="username"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                  autoComplete="tel"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>
            </>
          )}

          {/* Login / Signup Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              {isSignup ? "Email Address" : "Email or Username"}
            </label>

            <input
              type={isSignup ? "email" : "text"}
              name={isSignup ? "email" : "identifier"}
              value={isSignup ? form.email : form.identifier}
              onChange={handleChange}
              placeholder={
                isSignup
                  ? "example@email.com"
                  : "Email or @username"
              }
              required
              autoComplete={isSignup ? "email" : "username"}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          {/* Password */}
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
              minLength={isSignup ? 8 : undefined}
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

          {/* Confirm Password */}
          {isSignup && (
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
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

          {/* API Response Message */}
          {message && (
            <p
              role="status"
              className={`rounded-lg p-3 text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </button>

        </form>

        {/* Login / Signup Navigation */}
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
