import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { toast } from "@/hooks/use-toast";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Handle login submission
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:7777/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        // Use the login function from AuthContext
        console.log("Login response data:", data.data); // Debug log
        login({
          token: data.data.token,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          isVerified: data.data.isVerified,
        });

        // Show success message
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.data.name}!`,
        });

        // Redirect to the page the user was trying to access, or to the product page
        const from = location.state?.from || "/product";
        navigate(from);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle resend verification email
  async function handleResendVerification() {
    if (!verificationEmail) return;

    setResendLoading(true);

    try {
      const response = await fetch(
        "http://localhost:7777/api/users/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: verificationEmail }),
        }
      );

      const data = await response.json();
      console.log("Resend verification response:", data);

      if (data.success) {
        // Update verification URL
        if (data.data && data.data.verificationUrl) {
          setVerificationUrl(data.data.verificationUrl);
          alert("Verification email has been resent successfully!");
        }
      } else {
        alert(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      alert("An error occurred while resending the verification email.");
    } finally {
      setResendLoading(false);
    }
  }

  // Handle registration submission
  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:7777/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (data.success) {
        // Store verification URL if provided
        if (data.data && data.data.verificationUrl) {
          setVerificationUrl(data.data.verificationUrl);
          setVerificationEmail(email); // Store the email for resend functionality
        }

        // Switch to login tab
        setIsLogin(true);
        setError("");

        // Clear registration form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Verification Link Alert */}
        {verificationUrl && (
          <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
            <h3 className="text-blue-800 font-semibold mb-2">
              Email Verification Required
            </h3>
            <p className="text-blue-700 mb-3">
              Please verify your email to complete registration. If you didn't
              receive the email, you can use the link below:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify Email
              </a>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className={`px-4 py-2 rounded-md ${
                  resendLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors`}
              >
                {resendLoading ? "Sending..." : "Resend Email"}
              </button>
              <button
                onClick={() => {
                  setVerificationUrl("");
                  setVerificationEmail("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Note App
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your account or create a new one
        </p>

        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 w-1/2 text-center ${
                isLogin
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`py-2 px-4 w-1/2 text-center ${
                !isLogin
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
