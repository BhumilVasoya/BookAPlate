import React, { useState, useEffect } from 'react';
import '../App';
import { useNavigate } from 'react-router-dom';

const Reservation = ({ restaurant }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [guestName, setGuestName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [guestCount, setGuestCount] = useState(1);
  const [bookedGuests, setBookedGuests] = useState({});
  const [errors, setErrors] = useState({ mobile: false, email: false });

  const navigate = useNavigate();

  const lunchSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'];
  const dinnerSlots = ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'];
  const maxGuestsPerSlot = 50; // Maximum guests allowed per slot

  // Fetch and update booked guests for the selected restaurant, date, and time
  useEffect(() => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];

    const guestCounts = storedReservations
      .filter((res) =>
        res.reservationDate === selectedDate.toISOString().split('T')[0] &&
        res.restaurantId === restaurant.id
      )
      .reduce((acc, reservation) => {
        acc[reservation.selectedTime] = (acc[reservation.selectedTime] || 0) + reservation.guestCount;
        return acc;
      }, {});

    setBookedGuests(guestCounts);
  }, [selectedDate, restaurant.id]);

  // Get current time in minutes
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  // Filter available time slots (disable past slots if today)
  const filterTimeSlots = (slots) => {
    if (selectedDate.toDateString() !== new Date().toDateString()) return slots;

    const currentTime = getCurrentTime();
    return slots.filter((time) => {
      const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
      let totalMinutes = parseInt(hour) % 12 * 60 + parseInt(minute);
      if (period === 'PM') totalMinutes += 12 * 60;
      return totalMinutes > currentTime;
    });
  };

  const availableSlots = mealType === 'lunch' ? filterTimeSlots(lunchSlots) : filterTimeSlots(dinnerSlots);

  const validateFields = () => {
    let isValid = true;
    let errorsCopy = { mobile: false, email: false };

    if (!/^\d{10}$/.test(mobile)) {
      errorsCopy.mobile = true;
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorsCopy.email = true;
      isValid = false;
    }

    setErrors(errorsCopy);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!validateFields()) {
      
      return;
    }

    if (!selectedTime) {
      alert('Please select a time slot.');
      return;
    }

    // Check if guests exceed the limit
    if ((bookedGuests[selectedTime] || 0) + guestCount > maxGuestsPerSlot) {
      alert('This time slot is full or exceeds the 50-guest limit. Please select another time.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('User not logged in');
      return;
    }

    const reservationData = {
      guestName,
      email,
      mobile,
      reservationDate: selectedDate.toISOString().split('T')[0],
      selectedTime,
      mealType,
      guestCount,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: user.id,
    };

    // Save reservation and update local storage
    const existingReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    localStorage.setItem('reservations', JSON.stringify([...existingReservations, reservationData]));

    localStorage.setItem('restaurantName', restaurant.name);
    localStorage.setItem('guestCount', guestCount);


    alert(`Reservation confirmed for ${guestName} at ${selectedTime} for ${guestCount} guests.`);
    navigate('/payment', { state: reservationData });
  };

  // Guest count adjustment
  const incrementGuest = () => setGuestCount((prev) => prev + 1);
  const decrementGuest = () => setGuestCount((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="reservation-container">
      <nav className="navbar1">
        <div className="logo">
          <a href="/">
            <img src="/images/logo-1.png" alt="logo" />
          </a>
        </div>
      </nav>

      <div className="reservation-content">
        <div className="restaurant-info1">
          <img src={restaurant.imgSrc} alt={restaurant.name} className="restaurant-image" />
          <h2>{restaurant.name}</h2>
          <p>{restaurant.location}</p>
          <p>{restaurant.cuisine}</p>
          <span className="rating">⭐ {restaurant.rating}</span>
        </div>

        <div className="reservation-form">
          <h3>Select Date</h3>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
          />

          <h3>Select Meal Type</h3>
          <div className="meal-type">
            <button
              className={mealType === 'lunch' ? 'active' : ''}
              onClick={() => setMealType('lunch')}
            >
              Lunch
            </button>
            <button
              className={mealType === 'dinner' ? 'active' : ''}
              onClick={() => setMealType('dinner')}
            >
              Dinner
            </button>
          </div>

          <h3>Time</h3>
          <div className="time-slots">
            {availableSlots.length > 0 ? (
              availableSlots.map((time) => (
                <button
                  key={time}
                  className={time === selectedTime ? 'active' : ''}
                  onClick={() => setSelectedTime(time)}
                  disabled={(bookedGuests[time] || 0) + guestCount > maxGuestsPerSlot}
                >
                  {time} ({maxGuestsPerSlot - (bookedGuests[time] || 0)} spots left)
                </button>
              ))
            ) : (
              <p>No available slots</p>
            )}
          </div>

          <h3>Enter Guest Details</h3>
          <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Guest Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Mobile No."
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            pattern="\d{10}"
            title="Mobile number must be exactly 10 digits."
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

            <h3>Number of Guests</h3>
            <div className="guest-selector">
              <button type="button" onClick={decrementGuest}>-</button>
              <span className="guest-count">{guestCount}</span>
              <button type="button" onClick={incrementGuest}>+</button>
            </div>

            <button type="submit" className="submit-btn">Confirm Reservation</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
