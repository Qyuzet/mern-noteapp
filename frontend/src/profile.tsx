import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "./context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize form with user data
    if (user) {
      setName(user.name);
      setEmail(user.email);

      // Fetch the latest user data from the backend
      fetchUserProfile();
    }
  }, [user]);

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) return;

      const response = await fetch("http://localhost:7777/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Update user in context with the latest data
        login({
          name: data.data.name,
          email: data.data.email,
          token: token,
          role: data.data.role,
          isVerified: data.data.isVerified,
        });

        // Update form fields
        setName(data.data.name);
        setEmail(data.data.email);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();

    // Validate passwords if provided
    if (password && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:7777/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          ...(password ? { password } : {}), // Only include password if provided
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user in context
        login({
          name: data.data.name,
          email: data.data.email,
          token: token,
          role: data.data.role || user.role,
          isVerified:
            data.data.isVerified !== undefined
              ? data.data.isVerified
              : user.isVerified,
        });

        // Show success message
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });

        // Clear password fields
        setPassword("");
        setConfirmPassword("");
        setIsEditing(false);
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <form onSubmit={handleUpdateProfile}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing || isLoading}
              className={`w-full px-3 py-2 border rounded-md ${
                isEditing ? "border-blue-300" : "border-gray-300 bg-gray-50"
              }`}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing || isLoading}
              className={`w-full px-3 py-2 border rounded-md ${
                isEditing ? "border-blue-300" : "border-gray-300 bg-gray-50"
              }`}
              required
            />
          </div>

          {isEditing && (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password (leave blank to keep current)
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form
                    if (user) {
                      setName(user.name);
                      setEmail(user.email);
                    }
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Account Information
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Account Type:</span>{" "}
            {user.role === "admin" ? "Administrator" : "User"}
          </p>
          <p>
            <span className="font-medium">Email Verified:</span>{" "}
            {user.isVerified ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Member Since:</span>{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
