import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "qrcode"; 

export default function Confirmation() {
  const [reservation, setReservation] = useState({
    date: "N/A",
    time: "N/A",
    guests: "N/A",
    guestCount: 0,
    paymentMethod: "N/A",
    totalAmount: 0,
    reservationId: "",
    restaurantName: "N/A",
    guestName: "N/A",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch reservation details from localStorage
    const date = localStorage.getItem("reservationDate") || "N/A";
    const time = localStorage.getItem("reservationTime") || "N/A";
    const guests = localStorage.getItem("reservationGuests") || "N/A";
    const guestCount = parseInt(localStorage.getItem("guestCount"), 10) || 1;
    const paymentMethod = localStorage.getItem("paymentMethod") || "N/A";
    const restaurantName = localStorage.getItem("restaurantName") || "N/A";
    const guestName = localStorage.getItem("guestName") || "N/A";

    const totalAmount = guestCount * 50;

    const reservationId = `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setReservation({
      date,
      time,
      guests,
      guestCount,
      paymentMethod,
      totalAmount,
      reservationId,
      restaurantName,
      guestName,
    });

    navigate("/confirmation", { replace: true });

    // Push restaurant page to history stack to redirect on back press
    window.history.pushState(null, "", "/confirmation");
  
    const handleBackNavigation = () => {
      navigate("/restaurant");
    };
  
    window.addEventListener("popstate", handleBackNavigation);
  
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [navigate]);


  const generatePDF = async () => {
    const doc = new jsPDF();
  
    const primaryColor = [232, 37, 116]; // Pink (#e82574)
    const textDark = [12, 10, 9]; // Dark text (#0c0a09)
    const textLight = [120, 113, 108]; // Light text (#78716c)
    const highlightBg = [255, 242, 246]; // Light pink background
  
    // Header Section
    doc.setFillColor(...highlightBg);
    doc.rect(0, 0, 210, 40, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...primaryColor);
    doc.text("Reservation Confirmed", 20, 25);
  
    // Divider Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(...primaryColor);
    doc.line(20, 45, 190, 45);
  
    // Section Title Styling
    const sectionTitle = (title, y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...primaryColor);
      doc.text(title, 20, y);
    };
  
    // Details Text Styling
    const detailText = (label, value, y) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(...textDark);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(...textLight);
      doc.text(value, 70, y);
    };
  
    // Reservation Details Section
    sectionTitle("Your Reservation Details", 60);
  
    const details = [
      ["Reservation ID", reservation.reservationId],
      ["Restaurant", reservation.restaurantName],
      ["Date", reservation.date],
      ["Time", reservation.time],
      ["Guest Name", reservation.guests],
      ["Guest Count", `${reservation.guestCount}`],
      ["Payment Method", reservation.paymentMethod],
    ];
  
    // Render Reservation Details
    details.forEach((item, index) => {
      detailText(item[0], item[1], 75 + index * 12);
    });
  
    // Total Payment Highlight Box
    doc.setFillColor(...primaryColor);
    doc.roundedRect(20, 170, 170, 20, 5, 5, "F");
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(` Total Payment: ${reservation.totalAmount}`, 30, 183);

    const qrData = `Reservation ID: ${reservation.reservationId}\n` +
                   `Restaurant: ${reservation.restaurantName}\n` +
                   `Date: ${reservation.date}\n` +
                   `Time: ${reservation.time}\n` +
                   `Guest Name: ${reservation.guests}\n` +
                   `Guest Count: ${reservation.guestCount}\n` +
                   `Payment Method: ${reservation.paymentMethod}\n` +
                   `Total Amount: ₹${reservation.totalAmount}`;

    const qrImageUrl = await QRCode.toDataURL(qrData);

    // Add QR Code Image to PDF
    doc.addImage(qrImageUrl, "PNG", 75, 210, 60, 60);
  
    // Footer Message
    doc.setFontSize(12);
    doc.setTextColor(...textLight);
    doc.text("Thank you for dining with us!", 75, 280);
  
    // Save the PDF
    doc.save(`Reservation_${reservation.reservationId}.pdf`);
  };
  

  


  return (
    
    <div className="containerp">
  <div className="confirmation-card">
    <h2>🎉 Payment Successful! 🎉</h2>
    <p className="thank-you-text">
      Thank you for your reservation at <strong>{reservation.restaurantName}</strong>.
    </p>

    <div className="confirmation-details">
      <h3>Your Reservation Details</h3>
      <p><strong>Reservation ID:</strong> {reservation.reservationId}</p>
      <p><strong>Restaurant:</strong> {reservation.restaurantName}</p>
      <p><strong>Date:</strong> {reservation.date}</p>
      <p><strong>Time:</strong> {reservation.time}</p>
      <p><strong>Guest Name:</strong> {reservation.guests}</p>
      <p><strong>Guest Count:</strong> {reservation.guestCount}</p>
      <p><strong>Total Payment (₹50/guest):</strong> ₹{reservation.totalAmount}</p>
      <p><strong>Payment Method:</strong> {reservation.paymentMethod}</p>
    </div>

    <div className="btn-c">
      <button className="submit-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <button className="submit-btn" onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  </div>

  {/* Space at the bottom */}
  <div className="bottom-space"></div>
</div>

  );
}
