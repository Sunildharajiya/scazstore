
import React, { useEffect, useState } from "react";
import { checkServerHealth } from "../../services/serverHealth";

const ServerStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: "Checking server...",
  });

  useEffect(() => {
    let active = true;

    checkServerHealth().then((result) => {
      if (!active) return;

      setStatus({
        loading: false,
        ...result,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mb-4 rounded-lg border p-3">
      <h3 className="font-bold">Backend Health Check</h3>

      <p>
        Status:{" "}
        {status.loading
          ? "Checking..."
          : status.success
          ? "Connected"
          : "Connection Failed"}
      </p>

      <p>HTTP: {status.status}</p>
      <p className="break-all">Response: {status.message}</p>
    </div>
  );
};

const ProductDebug = ({ products = {}, loading, errors = {} }) => {
  return (
    <div className="mx-4 my-4 space-y-4 rounded-xl border-2 border-blue-400 bg-white p-4 text-sm text-gray-900">
      <h2 className="text-lg font-black text-blue-700">
        ScazStore Development Debugger
      </h2>

      {/* Backend Status */}
      <ServerStatus />

      {/* Loading Status */}
      <p>
        <strong>Products Loading:</strong> {String(loading)}
      </p>

      {/* Product Data */}
      {Object.entries(products).map(([section, items]) => (
        <div key={section} className="rounded-lg border p-3">
          <h3 className="font-bold">{section}</h3>

          <p>Array: {String(Array.isArray(items))}</p>
          <p>Count: {Array.isArray(items) ? items.length : "Invalid data"}</p>

          {Array.isArray(items) &&
            items.map((product, index) => (
              <div
                key={product?._id || index}
                className="mt-3 border-t pt-2"
              >
                <p>Name: {String(product?.name)}</p>
                <p>ID: {String(product?._id)}</p>
                <p>Price: ₹{String(product?.price)}</p>

                <p>
                  Image:{" "}
                  {product?.images?.[0]?.url
                    ? "Available"
                    : "Missing"}
                </p>
              </div>
            ))}

          {errors[section] && (
            <p className="mt-2 text-red-600">
              Error: {errors[section]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductDebug;
