import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-lg w-full">
          {/* ✅ Green tick */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Booking Confirmed</h1>
          <p className="text-gray-600 mb-8">
            Ref ID:{" "}
            <span className="font-semibold">
              {booking?.booking_reference || "HDFT1234"}
            </span>
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
