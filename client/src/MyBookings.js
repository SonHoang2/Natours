import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import Header from "./component/Header"
import { BOOKINGS_URL } from "./customValue"
import BookingCard from "./component/BookingCard";
import LeftUserSetting from "./component/LeftUserSetting";


export default function MyBookings() {
    const userJSON = localStorage.getItem("user");
    const user = userJSON ? JSON.parse(userJSON) : null;

    const tokenJSON = localStorage.getItem("token");
    const token = tokenJSON ? JSON.parse(tokenJSON) : null;
    
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
                    <LeftUserSetting role={user.role} />
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