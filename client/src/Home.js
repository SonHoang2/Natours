import Header from "./component/Header"
import Card from "./component/Card"
import { useSearchParams  } from "react-router-dom";
import { BOOKINGS_URL } from "./customValue"
import { useEffect, useState } from "react";
import { TOURS_URL } from "./customValue";
import { motion } from "framer-motion";

export default function Home({tours, setTours}) {
  const token = JSON.parse(localStorage.getItem("token"));

  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    sort: "",
    limit: "8",
    page: 1,

  });

  const getTours = async () => {
    try {
      const url = TOURS_URL + `/?sort=${queryParams.sort}&limit=${queryParams.limit}&page=${queryParams.page}`;
      const res = await fetch(url, {
        method: "GET",
    })
      const data = await res.json();
      if (data.data) {
        setTours(prev => {
          const obj = {
            ...prev,
            data: data.data.doc,
            length: data.total
          };
          localStorage.setItem("tour",  JSON.stringify(obj));
          return obj
        });
      }
    } catch(err) {
      console.log(err);
    }
  }

  const cards = () => {
      return tours.data.map((tour, i) => (
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      })
      const data = await res.json();
    } catch(err) {
      console.log(err);
    }
  }

  const navigateBefore = () => 
    setQueryParams(prev => {
      let obj = {...prev};
      if (prev.page > 1) {
        obj = {...prev, page: prev.page - 1}
      }
      return obj;
    })
  
  const navigateAfter = () => 
    setQueryParams(prev => {
      let obj = {...prev};
      if (prev.page < Math.ceil(tours.length / prev.limit)) {
        obj = {...prev, page: prev.page + 1 };
      }
      return obj;
    })

  useEffect(() => {
    // booking success
    if (searchParams.size === 3) {
      booking();
      setSearchParams("");
      alert("thank you for booking");
    };  
  }, [searchParams.size])

  useEffect(() => {
    getTours();
  }, [queryParams.sort, queryParams.page])

  return(
    <div>
      <Header />
      <div className="pb-5"></div>
      <div className="pb-5"></div>
      <motion.div 
        className="container-fluid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
      >
        <div className="bg-secondary-subtle shadow p-3 mb-4 rounded d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <p className="p-2 pe-4">Sort by</p>
            <button 
              className="btn btn-light me-3" 
              onClick={() => setQueryParams(prev => ({...prev, sort: "-ratingsQuantity"}))}
            >
              Popular</button>
            <button 
              className="btn btn-light me-3" 
              onClick={() => setQueryParams(prev => ({...prev, sort: "-createAt"}))}
            >
              Latest
            </button>
            <button 
              className="btn btn-light me-3" 
              onClick={() => setQueryParams(prev => ({...prev, sort: "price"}))}
            >
              Price: Low to High
            </button>
            <button 
              className="btn btn-light me-3" 
              onClick={() => setQueryParams(prev => ({...prev, sort: "-price"}))}
            >
              Price: High to Low
            </button>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p type="button" className="p-2 fs-5">
              <span className="text-success">{queryParams.page}</span>/{Math.ceil(tours.length / queryParams.limit)}
            </p>
            <p 
              type="button" 
              className="material-symbols-outlined bg-light rounded-1 text-black fs-1"
              onClick={navigateBefore}
            >
              navigate_before
            </p>
            <p type="button" 
              className="material-symbols-outlined bg-light rounded-1 text-black fs-1"
              onClick={navigateAfter}
            >
              navigate_next
            </p>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {cards()}
        </div>
      </motion.div>
    </div>
  )
}