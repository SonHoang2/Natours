import { useEffect, useState } from "react";
import Header from "./component/Header"
import Card from "./component/Card"
import { BOOKINGS_URL } from "./customValue"

export default function MyTours () {
  const [tours, setTours] = useState([]);

  const cards = () => {
    return tours.map((tour, i) => (
      <Card
        key={i}
        {...tour}
      />
    ))
  }

  const getBookings = async () => {
    try {
      const url = BOOKINGS_URL + `/my-tours`; 
      const res = await fetch(url, {
        method: "GET",
        credentials: 'include',
      })
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        setTours(data.tours)
      }
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getBookings()
  }, [])
  return (
    <div>
      <Header />
      <div className="pb-5"></div>
      <div className="pb-5"></div>
      <div className="container-fluid">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {cards()}
        </div>
      </div>
    </div> 
)}