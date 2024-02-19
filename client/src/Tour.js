import { useEffect, useState } from "react";
import Header from "./component/Header"
import { TOUR_IMAGE_URL, USER_IMAGE_URL, TOURS_URL } from "./customValue"
import { useNavigate } from "react-router-dom";

export default function Tour({tour}) {
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

  const stars = ratingStar => {
    const arr = []
    const remainStar = 5 - ratingStar

    for (let i = 0; i < ratingStar; i++) {
        arr.push((
              <span class="material-symbols-outlined fill">star</span>
        ))
    }
    for (let i = 0; i < remainStar; i++) {
        arr.push((
              <span className="material-symbols-outlined">star</span>
        ))
    }
    return arr
}

  const navigateBefore = () => 
    setQueryParams(prev => {
      console.log(prev);
      let obj = {...prev};
      if (prev.page > 1) {
        getReviews();
        obj = {...prev, page: prev.page - 1}
      }
      return obj;
    })
  
  const navigateAfter = () => 
    setQueryParams(prev => {
      let obj = {...prev};
      if (prev.page < Math.floor(reviews.length / prev.limit)) {
        getReviews();
        obj = {...prev, page: prev.page + 1 };
      }
      return obj;
    })
  

  useEffect(() => {
    getReviews();
  }, [])

  return (
    <div>
      <Header />
      <div className="d-flex justify-content-center h-900 position-relative">
        <img
            className="w-100 h-100 object-fit-cover"
            src={TOUR_IMAGE_URL + tour.imageCover} 
            alt="tour image" 
        />
        <div className="position-absolute bg-success w-100 h-100 opacity-50">
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
      <div className="container-xl pt-5">
        <div className="row">
          <div className="pe-4 ps-5 col-lg-6">
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
          <div className="col-lg-6 pb-5 ps-5 pe-5">
            <h3 className="text-uppercase text-success fw-bold pb-5 fs-4">about the park camper tour</h3>      
            <p className="lh-base fs-5">{tour.description}</p> 
          </div>
        </div>
      </div>
      <div className="container-xl p-0">
        <div className="d-flex pb-5 flex-column">
          {
            tour.images.map(image => (
              <div className="h-500">
                <img src={TOUR_IMAGE_URL + image} className="w-100 h-100 object-fit-cover"/>
              </div>
            ))
          }
        </div>
      </div>
      <div className="container-xl p-5 bg-success">
        <div className="pb-3">
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
            class="material-symbols-outlined text-white fs-1"
            onClick={navigateBefore}
          >
            navigate_before
          </span>
          <span type="button" class="bg-white p-2 fs-5">{queryParams.page}</span>
          <span type="button" 
            class="material-symbols-outlined text-white fs-1"
            onClick={navigateAfter}
          >
            navigate_next
          </span>
        </div>
      </div>
      <div className="container-xl mt-4 d-flex justify-content-center pb-3">
        <div className="shadow d-flex justify-content-between rounded p-5">
          <div className="pe-5">
            <p className="text-success pb-2 fw-bold text-uppercase">What are you waiting for?</p>
            <p className="text-secondary">{tour.duration} days. 1 adventure. Infinite memories. Make it yours today!</p>
          </div>
          <div className="d-flex">
            <button type="button" className="btn btn-success py-2 rounded-pill">LOGIN TO BOOK TOUR</button>
          </div>
        </div>
      </div>
    </div>
  )
} 