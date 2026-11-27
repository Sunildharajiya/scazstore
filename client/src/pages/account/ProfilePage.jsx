
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/accountApi.js";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch authenticated user profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getProfile();

      if (!result.success || !result.user) {
        throw new Error(result.message || "Unable to load profile.");
      }

      setUser(result.user);

    } catch (err) {
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Unable to load profile
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchProfile}
            className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="ml-3 text-sm text-gray-500 hover:text-green-700"
          >
            Home
          </button>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const fullName = [
    user.firstName,
    user.lastName,
  ].filter(Boolean).join(" ") || "ScazStore Customer";

  const initial = fullName.charAt(0).toUpperCase();

  const menuItems = [
    {
      title: "My Cart",
      description: "View your shopping cart",
      icon: "🛒",
      path: "/cart",
    },
    {
      title: "My Orders",
      description: "Track and manage orders",
      icon: "📦",
      path: "/orders",
    },
    {
      title: "My Products",
      description: "View your purchased products",
      icon: "🥬",
      path: "/my-products",
    },
    {
      title: "My Bills",
      description: "View your billing history",
      icon: "🧾",
      path: "/bills",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            My Account
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your profile and shopping activities.
          </p>
        </header>

        {/* Profile Card */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                {initial}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user.email || "Email not available"}
                </p>

                <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  {user.role || "Customer"}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile/edit")}
              className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Edit Profile →
            </button>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>

            <button
              onClick={() => navigate("/profile/edit")}
              className="text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2">

            <InfoItem label="First Name" value={user.firstName} />

            <InfoItem label="Last Name" value={user.lastName} />

            <InfoItem label="Username" value={user.userName} />

            <InfoItem label="Email Address" value={user.email} />

            <InfoItem label="Phone Number" value={user.mobile} />

            <InfoItem
              label="Secondary Phone"
              value={user.secondryMobile}
            />

            <InfoItem
              label="Pincode"
              value={user.deliveryAddress?.pincode}
            />

            <div className="sm:col-span-2">
              <InfoItem
                label="Delivery Address"
                value={user.deliveryAddress?.fullAddress}
              />
            </div>
          </div>
        </section>

        {/* Shopping Dashboard */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            My Shopping
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >
                <span className="text-3xl">{item.icon}</span>

                <h3 className="mt-5 font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {item.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-green-600">
                  View Details →
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">
            Account Settings
          </h2>

          <button
            onClick={() => navigate("/profile/edit")}
            className="flex w-full items-center justify-between border-b border-gray-100 py-4 text-left"
          >
            <div>
              <p className="font-medium text-gray-800">
                Edit Personal Information
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Update your name, phone and delivery address.
              </p>
            </div>

            <span>→</span>
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <div>
              <p className="font-medium text-gray-800">
                Order History
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Check your previous purchases.
              </p>
            </div>

            <span>→</span>
          </button>
        </section>

      </div>
    </main>
  );
};

// Reusable information component
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-2 break-words text-sm font-medium text-gray-800">
      {value || "Not provided"}
    </p>
  </div>
);

export default ProfilePage;
