import { useEffect, useState } from "react";
import Header from "./component/Header"
import { TOUR_IMAGE_URL, USER_IMAGE_URL, TOURS_URL, BOOKINGS_URL } from "./customValue"
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Tour({tour}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reviews, setReviews] = useState({
    data: [],
    length: "",
  });

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 3,
  });

  const navigate = useNavigate();

  const getReviews = async () => {
    try {
      const url = TOURS_URL + `/${tour.id}/reviews/?page=${queryParams.page}&limit=${queryParams.limit}`; 
      const res = await fetch(url, {
        method: "GET",
        credentials: 'include',
      })
      const data = await res.json();
  
      if (data.status === "success") {
        setReviews({
          data: data.data.doc,
          length: data.total
        })
      } else if (data.status === "fail") {
        window.alert(data.message);
        navigate("/user/login")
      }
  
    } catch(err) {
      console.log(err);
    }

  }

  const getCheckout = async () => {
    try {
      const url = BOOKINGS_URL + `/checkout-session/${tour.id}`; 
      const res = await fetch(url, {
        method: "GET",
        credentials: 'include',
      })
      const data = await res.json();
      if (data.status === "success") {
        window.location.href = data.session.url
      }
    } catch(err) {
      console.log(err);
    }
  } 

  const stars = ratingStar => {
    const arr = []
    const remainStar = 5 - ratingStar

    for (let i = 0; i < ratingStar; i++) {
        arr.push((
              <span className="material-symbols-outlined fill text-warning">star</span>
        ))
    }
    for (let i = 0; i < remainStar; i++) {
        arr.push((
              <span className="material-symbols-outlined text-warning">star</span>
        ))
    }
    return arr
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
      if (prev.page < Math.ceil(reviews.length / prev.limit)) {
        obj = {...prev, page: prev.page + 1 };
      }
      return obj;
    })

  useEffect(() => {
    getReviews();
  }, [queryParams.page])

  return (
    <div className="tour">
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
      > 
        <div className="d-flex justify-content-center h-900 position-relative">
          <img
              className="w-100 h-100 object-fit-cover"
              src={TOUR_IMAGE_URL + tour.imageCover} 
              alt="tour image" 
          />
          <div className="position-absolute bg-success-gradient w-100 h-100 opacity-50">
          </div>
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center flex-column">
            <div>
              <h1 className="text-white text-uppercase fs-1 pb-3 fw-bold">{tour.name} Tour</h1>
              <div className="d-flex justify-content-around">
                <div className="d-flex align-items-center">
                  <span className="material-symbols-outlined text-white pe-2">schedule</span>
                  <span className="text-white text-uppercase fw-bold">{tour.duration} days</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="material-symbols-outlined text-white pe-2">location_on</span>
                  <span className="text-white text-uppercase fw-bold">{tour.startLocation.description} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow px-5">
          <div className="row m-0 pb-5">
            <div className="col-lg-6 ps-0 pt-5">
              <div className="pb-5">
                <h3 className="text-uppercase text-success fw-bold pb-5 fs-3">quick facts</h3>
                <div className="d-flex align-items-center pb-4 fs-5">
                  <div className="d-flex pe-4 align-items-center">
                    <span className="material-symbols-outlined pe-2 text-success">calendar_month</span>
                    <p className="fw-bold">NEXT DATE</p>
                  </div>
                  <p>{new Date(tour.startDates[0]).toLocaleString('en-US', {month: "long", year: 'numeric'})}</p>
                </div>
                <div className="d-flex align-items-center pb-4 fs-5">
                  <div className="d-flex align-items-center pe-4">
                    <span className="material-symbols-outlined pe-2 text-success">trending_up</span>
                    <p className="fw-bold">DIFFICULTY</p>
                  </div>
                  <p className="text-capitalize">{tour.difficulty}</p>
                </div>
                <div className="d-flex align-items-center pb-4 fs-5">
                  <div className="d-flex align-items-center pe-4">
                    <span className="material-symbols-outlined pe-2 text-success">person</span>
                    <p className="fw-bold">PARTICIPANTS</p>
                  </div>
                  <p>{tour.maxGroupSize} People</p>
                </div>
                <div className="d-flex align-items-center pb-4 fs-5">
                  <div className="d-flex align-items-center pe-4">
                    <span className="material-symbols-outlined pe-2 text-success">star</span>
                    <p className="fw-bold">RATING</p>
                  </div>
                  <p>{tour.ratingsAverage} / 5</p>
                </div>
              </div>
              <div className="pb-5">
                <h3 className="text-uppercase text-success fw-bold pb-5 fs-4">your tour guides</h3>
                <div className="d-flex flex-column">
                  {
                    tour.guides.map(guide => (
                      <div className="d-flex align-items-center pb-3 fs-5">
                        <img className="user-avatar rounded-circle" src={USER_IMAGE_URL + guide.photo}/>
                        <p className="ps-3 text-uppercase fw-bold">{guide.role}</p>
                        <p className="ps-3 text-capitalize">{guide.name}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-6 ps-0 pt-5">
              <h3 className="text-uppercase text-success fw-bold pb-5 fs-4">about the park camper tour</h3>      
              <p className="lh-base fs-5">{tour.description}</p> 
            </div>
          </div>
          <div className="pb-5 timeline">
            <p className="text-uppercase text-success fw-bold pb-5 fs-4">itinerary</p>
            <div className="outer ms-5">
              <div className="ps-4 pb-5">
                <p className="fs-5 fw-bold title">
                  Day 0: {tour.startLocation.description}
                </p>
              </div>
              {tour.locations.map(location => (
                <div className="ps-4 pb-5">
                  <p className="fs-5 fw-bold title">
                    Day {location.day}: {location.description}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
          <div className="pb-5">
            <p className="text-uppercase text-success fw-bold pb-5 fs-4">Tour Images</p>
            <div className="d-flex ">
              {
                tour.images.map(image => (
                  <div className="h-500">
                    <img src={TOUR_IMAGE_URL + image} className="w-100 h-100 object-fit-cover"/>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="p-5 pt-0 bg-success">
            <div className="pb-3 pt-5">
              <span className="text-uppercase fw-bold fs-4 text-white">Product Ratings</span>
            </div>
            <div className="pb-4 d-flex bg-white rounded shadow mb-3">
              <p className="fs-5 p-2 rounded me-3"> 
                <span className="fs-4 fw-bold">{tour.ratingsAverage} </span> out of 5
              </p>
              <div>
                <p className="fs-5 p-2 rounded"> All ({reviews.length}) </p>
              </div>
            </div>
            <div>
              {
                reviews.data.map(review => (
                  <div className="bg-white rounded">
                    <div className="d-flex mb-4 p-4">
                      <img 
                        className="user-avatar rounded-circle"
                        src={USER_IMAGE_URL + review.user.photo}
                      />
                      <div className="ps-3">
                        <p className="pb-2">{review.user.name}</p>
                        <div className="d-flex pb-2">
                          {stars(review.rating)}
                        </div>
                        <p className="pb-4">{new Date(review.createAt).toLocaleString('en-US', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: "h24"
                          })}
                        </p>
                        <p>
                          {review.review}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <span 
                type="button" 
                className="material-symbols-outlined text-white fs-1"
                onClick={navigateBefore}
              >
                navigate_before
              </span>
              <span type="button" className="bg-white p-2 fs-5">{queryParams.page}</span>
              <span type="button" 
                className="material-symbols-outlined text-white fs-1"
                onClick={navigateAfter}
              >
                navigate_next
              </span>
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-center pb-3">
            <div className="shadow d-flex justify-content-between rounded p-5 flex-md-row flex-column">
              <div className="pb-3 pe-md-3">
                <p className="text-success pb-2 fw-bold text-uppercase fs-5">What are you waiting for?</p>
                <p className="text-secondary">{tour.duration} days. 1 adventure. Infinite memories. Make it yours today!</p>
              </div>
              {
                user ?
                <div className="d-flex align-items-start justify-content-center">
                  <button 
                    type="button" 
                    className="btn btn-warning py-2 px-4 rounded-pill text-white"
                    onClick={getCheckout}
                  >
                    BOOK TOUR
                  </button>
                </div> :
                <div className="d-flex align-items-start justify-content-center">
                  <button 
                    type="button" 
                    className="btn btn-warning py-2 px-4 rounded-pill text-white" 
                    onClick={() => navigate("/user/login")}
                    >
                      LOGIN TO BOOK TOUR
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 