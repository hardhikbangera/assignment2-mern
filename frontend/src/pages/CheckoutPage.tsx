import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingDetails = state?.bookingDetails;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    promoCode: "",
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);

  if (!bookingDetails)
    return <div className="text-center py-12">No booking details found.</div>;

  const handleApplyPromo = async () => {
    if (!formData.promoCode) return;

    try {
      const res = await fetch(`${API_BASE_URL}/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.promoCode,
          amount: bookingDetails.subtotal,
        }),
      });

      const data = await res.json();
      if (data.valid) {
        const discount = data.discount_amount;
        bookingDetails.discount = discount;
        bookingDetails.total =
          bookingDetails.subtotal - discount + bookingDetails.taxes;
        alert(`Promo applied! You saved ₹${discount}`);
      } else alert("Invalid promo code");
    } catch {
      alert("Error validating promo code");
    }
  };

  const handlePayAndConfirm = async () => {
    if (!formData.fullName || !formData.email || !formData.agreedToTerms) {
      alert("Please fill all required fields and accept terms.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_id: bookingDetails.experience.id,
          slot_id: bookingDetails.slot.id,
          customer_name: formData.fullName,
          customer_email: formData.email,
          quantity: bookingDetails.quantity,
          promo_code: formData.promoCode || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        navigate("/confirmation", { state: { booking: data.booking } });
      } else alert("Booking failed");
    } catch (err) {
      alert("Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) =>
                      setFormData({ ...formData, promoCode: e.target.value })
                    }
                    placeholder="SAVE10 or FLAT100"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreedToTerms: e.target.checked })
                  }
                />
                <label className="text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>
            </div>
          </div>

          {/* Booking summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="font-semibold text-right">
                    {bookingDetails.experience.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{formatDate(bookingDetails.slot.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span>{formatTime(bookingDetails.slot.time)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Qty</span>
                  <span>{bookingDetails.quantity}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{bookingDetails.subtotal}</span>
                </div>
                {bookingDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{bookingDetails.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{bookingDetails.taxes}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{bookingDetails.total}</span>
                </div>
              </div>

              <button
                onClick={handlePayAndConfirm}
                disabled={loading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay and Confirm"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
