



import React from "react";
import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";


const ProfilePage = ({
  user = {},
  cartItems = [],
  orders = [],
  bills = [],
  purchasedProducts = [],
}) => {

  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();

  const menuItems = [
    {
      title: "My Cart",
      description: "View your shopping cart",
      count: cartItems.length,
      icon: "🛒",
      path: "/cart",
    },
    {
      title: "My Orders",
      description: "Track and manage orders",
      count: orders.length,
      icon: "📦",
      path: "/orders",
    },
    {
      title: "My Products",
      description: "View your purchased products",
      count: purchasedProducts.length,
      icon: "🥬",
      path: "/my-products",
    },
    {
      title: "My Bills",
      description: "View your billing history",
      count: bills.length,
      icon: "🧾",
      path: "/bills",
    },
  ];

  const fullName =
    user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`
      : user?.name || "ScazStore Customer";

  const initial = fullName.charAt(0).toUpperCase();

  const handleLogout = async () => {
  try {
    localStorage.removeItem("accessToken");

    setIsLoggedIn(false);

    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            My Account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile and shopping activities.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                {initial}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user?.email || "Email not available"}
                </p>

                <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Customer Account
                </span>
              </div>
            </div>

            {/* IMPORTANT: Edit Button */}
            <button
              onClick={() => navigate("/profile/edit")}
              className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
            >
              Edit Profile →
            </button>

          </div>
        </div>

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

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2">

            <InfoItem
              label="First Name"
              value={user?.firstName}
            />

            <InfoItem
              label="Last Name"
              value={user?.lastName}
            />

            <InfoItem
              label="Email Address"
              value={user?.email}
            />

            <InfoItem
              label="Phone Number"
              value={user?.mobile}
            />

            <InfoItem
              label="Secondary Phone"
              value={user?.secondryMobile}
            />

            <InfoItem
              label="Pincode"
              value={user?.deliveryAddress?.pincode}
            />

            <div className="sm:col-span-2">
              <InfoItem
                label="Delivery Address"
                value={user?.deliveryAddress?.fullAddress}
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

                <div className="flex items-center justify-between">

                  <span className="text-3xl">
                    {item.icon}
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    {item.count}
                  </span>

                </div>

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

        {/* Recent Orders */}
        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Orders
            </h2>

            <button
              onClick={() => navigate("/orders")}
              className="text-sm font-semibold text-green-600"
            >
              View All →
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {orders.length > 0 ? (
              <div className="divide-y divide-gray-100">

                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-wrap items-center justify-between gap-3 p-5"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order._id?.slice(-8)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{order.totalAmount ?? order.total ?? 0}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {order.status || "Processing"}
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div className="p-10 text-center">
                <span className="text-4xl">📦</span>
                <p className="mt-3 font-semibold text-gray-800">
                  No orders yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Your recent orders will appear here.
                </p>

                <button
                  onClick={() => navigate("/products")}
                  className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Start Shopping
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-gray-900">
            Account Settings
          </h2>

          <button
            onClick={() => navigate("/profile/edit")}
            className="mt-5 flex w-full items-center justify-between border-b border-gray-100 py-4 text-left"
          >
            <div>
              <p className="font-medium text-gray-800">
                Edit Personal Information
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Update your name, phone and delivery address.
              </p>
            </div>
            <span className="text-gray-400">→</span>
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
            <span className="text-gray-400">→</span>
          </button>
          <button
  onClick={handleLogout}
  className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 transition"
>
  Logout
</button>

        </section>

      </div>
    </div>
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
