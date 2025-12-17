import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../App';
import { QRCodeCanvas } from "qrcode.react";


export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [amount, setAmount] = useState(50);
  const [restaurantName, setRestaurantName] = useState("N/A"); // Store restaurant name
  const navigate = useNavigate();
  const location = useLocation();

  const [reservation, setReservation] = useState({
    date: "N/A",
    time: "N/A",
    guests: "N/A",
    email: "N/A",
  });

  const { guestName, email, reservationDate, selectedTime } = location.state || {};

  useEffect(() => {
    const storedGuestCount = location.state?.guestCount || 1; // Use guestCount from reservation
    setGuestCount(storedGuestCount);
    setAmount(storedGuestCount * 50);
  
    const storedRestaurantName = localStorage.getItem("restaurantName") || "N/A";
    setRestaurantName(storedRestaurantName);
  
    if (guestName) {
      setReservation({
        date: reservationDate || "N/A",
        time: selectedTime || "N/A",
        guests: guestName || "N/A",
        email: email || "N/A",
      });
    }
  }, [guestName, email, reservationDate, selectedTime, location.state]);

  const handleUpiIdChange = (e) => {
    // Allow UPI format: alphanumeric@upi (e.g., example@upi)
    const value = e.target.value;
    const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
  
    if (value === "" || upiPattern.test(value) || !value.includes(" ")) {
      setUpiId(value);
    }
  };
  
  const handlePhoneNumberChange = (e) => {
    // Allow only digits and limit to 10 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
  };
  
  
  
  const handleCardNameChange = (e) => {
    // Allow only letters (including spaces for full names)
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setNameOnCard(value);
  };
  
  const handleCardNumberChange = (e) => {
    // Allow only digits and limit to 12 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setCardNumber(value);
  };
  
  const handleCvvChange = (e) => {
    // Allow only digits and limit to 3 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };
  

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (paymentMethod === "google-pay" && !upiId) {
      alert("Please enter a valid UPI ID.");
      return;
    }
  
    if (paymentMethod === "amazon-pay" && phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    alert(`Payment successful using ${paymentMethod}`);

    // Save reservation and payment details to localStorage
    localStorage.setItem("reservationDate", reservation.date);
    localStorage.setItem("reservationTime", reservation.time);
    localStorage.setItem("reservationGuests", reservation.guests);
    localStorage.setItem("paymentMethod", paymentMethod);


    navigate("/confirmation");
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
      <h2 className="payment-title">
      Confirm Your <span className="title-highlight">Table Reservation</span>
    </h2>
    <p className="payment-subtitle">
      Secure your table at <strong>{restaurantName}</strong> with a quick payment.
    </p>
  </div>

  <div className="payment-section">
    {/* Reservation Summary */}
    <div className="reservation-summary">
    <h3 className="summary-title">🍽️ Reservation Details</h3>
      <div className="summary-details">
        <p><span>🏠 Restaurant:</span> {restaurantName}</p>
        <p><span>📅 Date:</span> {reservation.date}</p>
        <p><span>⏰ Time:</span> {reservation.time}</p>
        <p><span>👤 Reserved By:</span> {reservation.guests}</p>
        <p><span>📧 Contact Email:</span> {reservation.email}</p>
        <p><span>👥 Guests:</span> {guestCount}</p>
        <p><span>💸 Total Amount (₹50/guest):</span> ₹{amount}</p>
      </div>
    </div>

    {/* Payment Form */}
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Select Payment Method</h3>

      <div className="payment-options">
        {[
          { method: "google-pay", label: "Google Pay", imgSrc: "https://img.icons8.com/?size=100&id=w0MU3YDSYG7T&format=png&color=000000" },
          { method: "amazon-pay", label: "Amazon Pay", imgSrc: "https://img.icons8.com/?size=100&id=2nt5XhjL7jBK&format=png&color=000000" },
          { method: "credit-card", label: "Credit Card", imgSrc: "https://img.icons8.com/?size=100&id=UvYxbNPWUVPa&format=png&color=000000" },
          { method: "debit-card", label: "Debit Card", imgSrc: "https://img.icons8.com/?size=100&id=UvYxbNPWUVPa&format=png&color=000000" },
          { method: "qr-code", label: "Scan QR Code", imgSrc: "/images/icons8-qr-48.png" },
        ].map(({ method, label, imgSrc }) => (
          <label key={method} className={`payment-label ${paymentMethod === method ? "active" : ""}`}>
            <input
              type="radio"
              name="payment-method"
              value={method}
              checked={paymentMethod === method}
              onChange={handlePaymentChange}
              required
            />
            <img src={imgSrc} alt={label} className="payment-icon" />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {(paymentMethod === "google-pay" || paymentMethod === "amazon-pay") && (
        <div className="input-group1">
          <label>
      {paymentMethod === "google-pay"
        ? "Enter UPI ID (e.g., user@upi)"
        : "Enter Phone Number (10 digits)"}
    </label>

    {paymentMethod === "google-pay" ? (
      <input
        type="text"
        value={upiId}
        onChange={handleUpiIdChange}
        placeholder="user@upi"
        required
      />
    ) : (
      <input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="9876543210"
        required
      />
    )}
        </div>
      )}

      {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
        <div className="input-group1">
          <label>Name on Card</label>
          <input
            type="text"
            value={nameOnCard}
            onChange={handleCardNameChange}
            placeholder="Cardholder's Name"
            required
            />

          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9101"
            required
          />

          <div className="card-details">
            <div>
              <label>Expiry Date</label>
              <input
                type="month"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>
            <div>
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
      )}

{paymentMethod === "qr-code" && (
  <div className="qr-code-container">
    <h3>Scan to Pay</h3>
    <QRCodeCanvas value={`upi://pay?pa=bhumil23v@oksbi&pn=Bhumil Vasoya&am=${amount}&cu=INR`} size={200} />
    <p>Scan this QR Code to complete the payment</p>
  </div>
)}

      <button type="submit" className="pay-button">Pay Now</button>
    </form>
  </div>
</div>

  );
}
