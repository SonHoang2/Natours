import Header from "./component/Header"
import Card from "./component/Card"
import { useSearchParams  } from "react-router-dom";
import { BOOKINGS_URL } from "./customValue"
import { useEffect } from "react";


export default function Home({tours}) {
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams.size);
  const cards = () => {
      return tours.map((tour, i) => (
        <Card
          key={i}
          {...tour}
        />
      ))
  }

  const booking = async () => {
    try {
      const tour = searchParams.get("tour");
      const user = searchParams.get("user");
      const price = searchParams.get("price");

      const url = BOOKINGS_URL + "/checkout-session/"; 
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({tour, user, price}),
        credentials: 'include', 
        headers: {'Content-Type': 'application/json'},
      })
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {

      }
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // booking success
    if (searchParams.size === 3) {
      booking();
      setSearchParams("");
      alert("thank you for booking");
    };  
  }, [searchParams.size])

  return(
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
  )
}