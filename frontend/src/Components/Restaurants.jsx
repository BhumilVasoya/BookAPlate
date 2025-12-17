import React, { useState } from 'react';
import Reservation from './Reservation';

const restaurants = [
  {
    name: 'The Grand Jyoti',
    location: '228-24, Pij Bhagole Rd, Junaraopura, Nadiad, Gujarat 387001',
    cuisine: 'Fast Food',
    rating: 4.3,
    imgSrc: '/images/TGJ.jpg',
    popular: true,
    city: 'Nadiad',
  },
  {
    name: 'Swad Restaurant',
    location:
      'First Floor, Shashwat Complex, TA Nadiad College Road, Nadiad Locality, Nadiad, Gujarat',
    cuisine: 'Chinese, Indian, Vegetarian',
    rating: 4.9,
    imgSrc: '/images/SR.jpg',
    popular: false,
    city: 'Nadiad',
  },
  {
    name: 'Bhagyoday Restaurant',
    location: '20, Piplag Rd, Gokul Dham Society, Indira Nagar, Nadiad, Gujarat 387002',
    cuisine: 'North Indian',
    rating: 4.4,
    imgSrc: '/images/BR.webp',
    popular: true,
    city: 'Nadiad',
  },
];

const Restaurants = () => {
  const [selectedCity, setSelectedCity] = useState('Nadiad');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.city === selectedCity &&
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <div className="container1">
      {!selectedRestaurant ? (
        <>
          <nav className="navbar1">
            <div className="logo">
              <a href="/">
                <img src="/images/logo-1.png" alt="logo" />
              </a>
            </div>
            <div className="city-selector">
              <label htmlFor="city">City:</label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="Nadiad">Nadiad</option>
                <option value="Anand">Anand</option>
                <option value="Vadodara">Vadodara</option>
              </select>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for Restaurants, Offers, Deals or Events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn s_btn">Search</button>
            </div>
          </nav>

          <div className="restaurant-list">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={index}
                className="restaurant-card"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <img src={restaurant.imgSrc} alt={restaurant.name} />
                <div className="restaurant-info">
                  {restaurant.popular && <span className="popular">Popular for food</span>}
                  <h2>{restaurant.name}</h2>
                  <p>{restaurant.location}</p>
                  <p>{restaurant.cuisine}</p>
                  <span className="rating">{restaurant.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Reservation restaurant={selectedRestaurant} />
      )}
    </div>
  );
};

export default Restaurants;
