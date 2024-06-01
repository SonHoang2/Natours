import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"
import Header from "./component/Header"
import { BOOKINGS_URL } from "./customValue"
import BookingCard from "./component/BookingCard";

export default function MyBookings () {
  const token = JSON.parse(localStorage.getItem("token"));
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      const url = BOOKINGS_URL + `/my-tours`; 
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json();
      if (data.status === "success") {
        setBookings(data.bookings)
      }
    } catch(err) {
      console.log(err);
    }
  }

  const cards = () => {
    return bookings.map((booking, i) => (
      <BookingCard 
        booking={booking}
        key={i}
      />
    ))
  }

  useEffect(() => {
    getBookings()
  }, [])
  return (
    <div className="h-100">
      <Header />
      <motion.div 
        className="bg-body-secondary h-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
      >
        <div className="pb-5"></div>
        <div className="pb-5"></div>
        <div className="d-flex justify-content-center bg-body-secondary pb-5">
          <div className="bg-success p-5 w-400 rounded-start">
            <Link to="/user/me" className="text-decoration-none">
              <div className="d-flex align-items-center pb-4">
                <span className="material-symbols-outlined pe-3 text-white">settings</span>
                <p className="text-white">SETTINGS</p>
              </div>
            </Link>
            <Link to="/user/my-bookings" className="text-decoration-none">
              <div className="d-flex align-items-center pb-4">
                <span className="material-symbols-outlined pe-3 text-white">work</span>
                <p className="text-white">MY BOOKINGS</p>
              </div>
            </Link>
            <Link to="/user/my-reviews" className="text-decoration-none">
              <div className="d-flex align-items-center pb-4">
                <span className="material-symbols-outlined pe-3 text-white">star</span>
                <p className="text-white">MY REVIEWS</p>
              </div>
            </Link>
          </div>
          <div className="bg-white w-500 rounded-end">
            <div className="p-5 pb-3">
            <p className="text-success fw-bold pb-4">MY BOOKINGS</p>

            {cards()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
)}