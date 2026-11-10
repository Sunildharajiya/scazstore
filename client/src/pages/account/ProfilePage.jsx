import { useCallback, useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
  getMyOrders,
  getAddresses,
  updateReceiverDetails,
} from "../../services/accountApi";

const TABS = [
  { id: "profile", label: "My Profile", icon: "👤" },
  { id: "addresses", label: "My Addresses", icon: "📍" },
  { id: "orders", label: "My Orders", icon: "📦" },
];

const ORDER_STEPS = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const formatStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load account information
  const loadAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [profileData, addressData, orderData] =
        await Promise.all([
          getProfile(),
          getAddresses(),
          getMyOrders(),
        ]);

      setProfile(profileData.user || profileData);
      setAddresses(
        addressData.addresses || addressData || []
      );
      setOrders(orderData.orders || orderData || []);

    } catch (err) {
      setError(err.message || "Unable to load account.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadAccount();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadAccount]);

  // Edit profile fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const result = await updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });

      setProfile(result.user || result);

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Save parcel receiver information
  const handleReceiverUpdate = async (orderId, details) => {
    try {
      await updateReceiverDetails(orderId, details);

      setMessage("Receiver details updated successfully!");

      await loadAccount();
    } catch (err) {
      setMessage(err.message || "Unable to update receiver details.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-red-600">{error}</p>

        <button
          onClick={loadAccount}
          className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-8 sm:px-6">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your profile, addresses and orders.
          </p>
        </div>

        {/* Profile Header */}
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green-100 text-3xl">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {profile.name || "Customer"}
            </h2>

            <p className="text-sm text-gray-500">
              {profile.email}
            </p>

            <p className="text-xs text-gray-400">
              Customer ID: {profile._id || "—"}
            </p>
          </div>

        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm">

          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}

        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

            <h2 className="mb-6 text-xl font-bold">
              Personal Information
            </h2>

            <form
              onSubmit={handleSaveProfile}
              className="grid gap-5 sm:grid-cols-2"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <input
                  name="name"
                  value={profile.name || ""}
                  onChange={handleProfileChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  onChange={handleProfileChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleProfileChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>

          </section>
        )}

        {/* Address Tab */}
        {activeTab === "addresses" && (
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center justify-between gap-3">

              <h2 className="text-xl font-bold">
                My Delivery Addresses
              </h2>

              <button
                onClick={() => setMessage("Connect your Add Address form here.")}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
              >
                + Add Address
              </button>

            </div>

            {addresses.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                No saved addresses.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">

                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="rounded-xl border border-gray-200 p-5"
                  >

                    <div className="mb-3 flex justify-between">
                      <h3 className="font-bold">
                        📍 {address.label || "Home"}
                      </h3>

                      {address.isDefault && (
                        <span className="text-xs font-bold text-green-600">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-6 text-gray-600">
                      {address.house},
                      {" "}{address.area},
                      {" "}{address.landmark},
                      {" "}{address.city},
                      {" "}{address.state} -
                      {" "}{address.pincode}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      {address.phone}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <section>

            <h2 className="mb-5 text-xl font-bold">
              My Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
                <p className="text-5xl">📦</p>

                <h3 className="mt-4 font-bold">
                  No Orders Yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Your orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">

                {orders.map((order) => (
                  <article
                    key={order._id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">

                      <div>
                        <p className="text-xs text-gray-400">
                          ORDER ID
                        </p>

                        <h3 className="font-bold">
                          #{order.orderNumber || order._id}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                        {formatStatus(order.status)}
                      </span>

                    </div>

                    {/* Products */}
                    <div className="my-4 space-y-3">

                      {(order.items || []).map((item) => (
                        <div
                          key={item.productId || item._id}
                          className="flex items-center gap-3"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-lg bg-gray-50 object-contain"
                          />

                          <div className="flex-1">
                            <p className="text-sm font-bold">
                              {item.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="text-sm font-bold">
                            ₹{item.price * item.quantity}
                          </p>

                        </div>
                      ))}

                    </div>

                    {/* Delivery summary */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">

                      <div>
                        <p className="text-xs text-gray-400">
                          TOTAL AMOUNT
                        </p>

                        <p className="text-xl font-black text-green-700">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder?._id === order._id
                              ? null
                              : order
                          )
                        }
                        className="rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
                      >
                        {selectedOrder?._id === order._id
                          ? "Hide Details"
                          : "Track Order →"}
                      </button>

                    </div>

                    {/* Expanded tracking */}
                    {selectedOrder?._id === order._id && (
                      <OrderTracking
                        order={order}
                        onReceiverUpdate={handleReceiverUpdate}
                      />
                    )}

                  </article>
                ))}

              </div>
            )}

          </section>
        )}

        {/* Notification */}
        {message && (
          <div
            role="status"
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
          >
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-4"
            >
              ✕
            </button>
          </div>
        )}

      </div>
    </main>
  );
};


// Order Tracking Component
const OrderTracking = ({ order, onReceiverUpdate }) => {
  const [editingReceiver, setEditingReceiver] = useState(false);

  const [receiver, setReceiver] = useState({
    name: order.receiver?.name || "",
    phone: order.receiver?.phone || "",
  });

  const currentStep = ORDER_STEPS.indexOf(order.status);

  const delivery = order.delivery || {};
  const receiverEditable = [
    "placed",
    "confirmed",
    "packed",
  ].includes(order.status);

  return (
    <div className="mt-6 space-y-6 border-t pt-6">

      {/* Estimated Delivery */}
      <div className="rounded-xl bg-green-50 p-5">

        <p className="text-xs font-bold uppercase text-green-700">
          Expected Delivery
        </p>

        <h3 className="mt-2 text-2xl font-black text-green-900">
          {delivery.estimatedDate
            ? new Date(delivery.estimatedDate).toLocaleDateString("en-IN")
            : "Awaiting confirmation"}
        </h3>

        <p className="mt-1 text-sm text-green-800">
          {delivery.estimatedTime || "Delivery time will be updated."}
        </p>

      </div>

      {/* Tracking Timeline */}
      <div>
        <h3 className="mb-5 font-bold">
          Order Tracking
        </h3>

        <div className="space-y-5">

          {ORDER_STEPS.map((step, index) => {
            const completed =
              currentStep >= index && currentStep !== -1;

            return (
              <div
                key={step}
                className="flex items-start gap-4"
              >

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    completed
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <div>
                  <p className={`font-bold ${
                    completed ? "text-green-700" : "text-gray-500"
                  }`}>
                    {formatStatus(step)}
                  </p>

                  {order.trackingEvents?.find(
                    (event) => event.status === step
                  ) && (
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(
                        order.trackingEvents.find(
                          (event) => event.status === step
                        ).timestamp
                      ).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* Delivery Person */}
      {delivery.personName && (
        <div className="rounded-xl border p-5">

          <h3 className="mb-4 font-bold">
            🚚 Delivery Partner
          </h3>

          <p className="font-semibold">
            {delivery.personName}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {delivery.phone}
          </p>

          {delivery.phone && (
            <a
              href={`tel:${delivery.phone}`}
              className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-2 text-sm font-bold text-white"
            >
              📞 Call Delivery Partner
            </a>
          )}

        </div>
      )}

      {/* Parcel Receiver */}
      <div className="rounded-xl border p-5">

        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-bold">
            📦 Parcel Receiver Details
          </h3>

          {receiverEditable && (
            <button
              onClick={() => setEditingReceiver(!editingReceiver)}
              className="text-sm font-bold text-green-600"
            >
              {editingReceiver ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {editingReceiver ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onReceiverUpdate(order._id, receiver);
              setEditingReceiver(false);
            }}
            className="space-y-3"
          >

            <input
              value={receiver.name}
              onChange={(e) =>
                setReceiver({
                  ...receiver,
                  name: e.target.value,
                })
              }
              placeholder="Receiver Name"
              required
              className="w-full rounded-lg border p-3"
            />

            <input
              type="tel"
              value={receiver.phone}
              onChange={(e) =>
                setReceiver({
                  ...receiver,
                  phone: e.target.value,
                })
              }
              placeholder="Receiver Mobile"
              required
              className="w-full rounded-lg border p-3"
            />

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-5 py-2 font-bold text-white"
            >
              Save Receiver Details
            </button>

          </form>
        ) : (
          <>
            <p className="font-semibold">
              {order.receiver?.name || "Not provided"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {order.receiver?.phone || "No contact number"}
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {order.deliveryAddress?.house},
              {" "}{order.deliveryAddress?.area},
              {" "}{order.deliveryAddress?.city},
              {" "}{order.deliveryAddress?.state} -
              {" "}{order.deliveryAddress?.pincode}
            </p>
          </>
        )}

      </div>

      {/* Payment */}
      <div className="rounded-xl bg-gray-50 p-4">

        <h3 className="font-bold">
          Payment Information
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Payment Method: {order.paymentMethod || "—"}
        </p>

        <p className="mt-1 text-sm text-gray-600">
          Payment Status: {formatStatus(order.paymentStatus)}
        </p>

      </div>

    </div>
  );
};

export default ProfilePage;