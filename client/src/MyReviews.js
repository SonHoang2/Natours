import { useState, useEffect } from "react"
import { REVIEWS_URL, TOUR_IMAGE_URL } from "./customValue"
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Header from "./component/Header"
import ReviewCard from "./component/ReviewCard";

export default function MyReviews () {
  const [reviews, setReviews] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  const getReviews = async () => {
    try {
      const url = REVIEWS_URL + `/me`; 
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json();
      if (data.status === "success") {
        setReviews(data.reviews)
      }
    } catch(err) {
      console.log(err);
    }
  }

  const cards = () => {
    return reviews.map((review, i) => (
      <ReviewCard 
        review={review}
        key={i}
      />
    ))
  }

  useEffect(() => {
    getReviews()
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
            <p className="text-success fw-bold pb-4">MY REVIEWS</p>
              {cards()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}