import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardHeader from "../pages/header/cardHeader";
import "../pages/cart/CardPage.css";

export const Notify = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      // Ensure token is available
      const token = localStorage.token;
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      // Make the API call with the token
      const response = await axios.get("http://localhost:5000/api/notify", {
        headers: {
          Authorization: token,
        },
      });

      // Check if the response data has the expected structure
      if (response.status === 200 && response.data.cart) {
        console.log(response.data.cart, "responseeeeeeeee");
        setCart(response.data.cart);
      } else {
        console.error("Error: Cart data is missing or incorrect structure.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Handle product click to navigate to /dashboard with product data
  const handleProductClick = (product) => {
    navigate("/dashboard", {
      state: { product }, // Pass the product data to the dashboard route
    });
  };

  return (
    <>
      <CardHeader />
      <div className="app-container">
        <h1 className="heading">Your Cart</h1>

        <div className="cart-items-container">
          {cart?.length > 0 ? (
            cart.map((item) => (
              <div
                key={item._id}
                className="cart-item"
                onClick={() => handleProductClick(item)} // Navigate on click
              >
                <h2>{item.title}</h2>
                <p>Price: ${item.amount}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notify;
