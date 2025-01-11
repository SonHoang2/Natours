import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import Header from "../component/Header";
import { BOOKINGS_URL } from "../customValue"
import BookingCard from "../component/BookingCard";
import LeftUserSetting from "../component/LeftUserSetting";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);

    const getBookings = async () => {
        try {
            const url = BOOKINGS_URL + `/my-tours`;
            const data = await axios.get(url, {
                withCredentials: true
            });

            setBookings(data.bookings)
        } catch (err) {
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
                exit={{ opacity: 0 }}
            >
                <div className="pb-5"></div>
                <div className="pb-5"></div>
                <div className="d-flex justify-content-center bg-body-secondary pb-5">
                    <LeftUserSetting/>
                    <div className="bg-white w-500 rounded-end">
                        <div className="p-5 pb-3">
                            <p className="text-success fw-bold pb-4">MY BOOKINGS</p>
                            {cards()}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}