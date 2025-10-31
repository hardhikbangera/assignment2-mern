import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";


interface Slot {
  id: number;
  experience_id: number;
  date: string;
  time: string;
  available_slots: number;
  total_slots: number;
}

interface Experience {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  category: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperienceDetails();
  }, [id]);

  const fetchExperienceDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/experiences/${id}`);
      const data = await res.json();
      setExperience(data.experience);
      setSlots(data.slots || []);
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (timeString: string) => timeString.slice(0, 5);

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const handleConfirm = () => {
    if (!selectedSlot || !experience) {
      alert("Please select a date and time slot before continuing.");
      return;
    }

    const subtotal = experience.price * quantity;
    const taxes = Math.round(subtotal * 0.059);
    const total = subtotal + taxes;

    navigate("/checkout", {
      state: {
        bookingDetails: {
          experience,
          slot: selectedSlot,
          quantity,
          subtotal,
          taxes,
          discount: 0,
          total,
        },
      },
    });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!experience) return <div className="text-center py-12">Experience not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-900 mb-6">
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* ✅ Fixed image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
              <img
                src={
                  experience.image_url?.startsWith("http")
                    ? experience.image_url
                    : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${experience.image_url}`
                }
                alt={experience.name}
                className="w-full h-96 object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/800x400?text=No+Image")
                }
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h1 className="text-3xl font-bold mb-4">{experience.name}</h1>
              <p className="text-gray-600 mb-6">{experience.description}</p>

              {/* Date selector */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Choose date</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(groupedSlots).slice(0, 5).map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedDate === date
                          ? "bg-yellow-400 border-yellow-400 text-black font-semibold"
                          : "border-gray-300 hover:border-yellow-400"
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selector */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Choose time</h3>
                  <div className="flex gap-2 flex-wrap">
                    {groupedSlots[selectedDate].map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        disabled={slot.available_slots === 0}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedSlot?.id === slot.id
                            ? "bg-yellow-400 border-yellow-400 text-black font-semibold"
                            : slot.available_slots === 0
                            ? "border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "border-gray-300 hover:border-yellow-400"
                        }`}
                      >
                        {formatTime(slot.time)}{" "}
                        {slot.available_slots > 0 ? `${slot.available_slots} left` : "Sold out"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600 text-sm">
                  Scenic routes, trained guides, and safety briefing. Minimum age 10.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Starts at</span>
                <span className="text-2xl font-bold">₹{experience.price}</span>
              </div>

              <div className="mb-4">
                <span className="text-gray-600 block mb-2">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border-2 border-gray-300 rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border-2 border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{experience.price * quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold">
                    ₹{Math.round(experience.price * quantity * 0.059)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ₹{experience.price * quantity +
                      Math.round(experience.price * quantity * 0.059)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
