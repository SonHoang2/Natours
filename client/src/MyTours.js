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
      <div className="pb-3"></div>
      <div className="container-fluid">
        <div className="card-deck">
          {cards()}
        </div>
      </div>
    </div> 
)}