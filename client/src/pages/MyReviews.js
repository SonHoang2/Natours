import { useState, useEffect } from "react"
import { REVIEWS_URL } from "../customValue"
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Header from "../component/Header";
import ReviewCard from "../component/ReviewCard";
import LeftUserSetting from "../component/LeftUserSetting";
import axios from "axios";


export default function MyReviews() {
    const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
        try {
            const url = REVIEWS_URL + `/me`;

            const data = await axios.get(url, { withCredentials: true })

            setReviews(data.reviews)
        } catch (err) {
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
                exit={{ opacity: 0 }}
            >
                <div className="pb-5"></div>
                <div className="pb-5"></div>
                <div className="d-flex justify-content-center bg-body-secondary pb-5">
                    <LeftUserSetting/>
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