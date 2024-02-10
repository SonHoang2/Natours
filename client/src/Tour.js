import Header from "./component/Header"
import { TOUR_IMAGE_URL } from "./customValue"

export default function Tour({tour}) {
  console.log(tour);
  return (
    <div>
      <Header />
      <div className="d-flex justify-content-center h-500 position-relative">
        <img
            className="w-100 h-100 object-fit-cover"
            src={TOUR_IMAGE_URL + tour.imageCover} 
            alt="tour image" 
        />
        <div className="position-absolute bg-success w-100 h-100 opacity-50">
        </div>
        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center flex-column">
          <div>
            <h1 className="text-white text-uppercase fs-1 pb-3">{tour.name} Tour</h1>
            <div className="d-flex justify-content-around">
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined text-white pe-2">schedule</span>
                <span className="text-white text-uppercase">{tour.duration} days</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined text-white pe-2">location_on</span>
                <span className="text-white text-uppercase">{tour.startLocation.description} days</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="container-xl pt-5">
        <div className="row">
          <div className="pe-4 ps-5 col-lg-6">
            <div className="pb-5">
              <h3 className="text-uppercase text-success fw-bold pb-4 fs-3">quick facts</h3>
              <div className="d-flex">
                <div className="d-flex pe-4">
                  <span className="material-symbols-outlined pe-2 text-success">calendar_month</span>
                  <p className="fw-bold">NEXT DATE</p>
                </div>
                <p>{new Date(tour.startDates[0]).toLocaleString('en-US', {month: "long", year: 'numeric'})}</p>
              </div>
              <div className="d-flex">
                <div className="d-flex pe-4">
                  <span className="material-symbols-outlined pe-2 text-success">trending_up</span>
                  <p className="fw-bold">DIFFICULTY</p>
                </div>
                <p className="text-capitalize">{tour.difficulty}</p>
              </div>
              <div className="d-flex">
                <div className="d-flex pe-4">
                  <span className="material-symbols-outlined pe-2 text-success">person</span>
                  <p className="fw-bold">PARTICIPANTS</p>
                </div>
                <p>{tour.maxGroupSize} People</p>
              </div>
              <div className="d-flex">
                <div className="d-flex pe-4">
                  <span className="material-symbols-outlined pe-2 text-success">star</span>
                  <p className="fw-bold">RATING</p>
                </div>
                <p>{tour.ratingsAverage} / 5</p>
              </div>
            </div>
            <div className="pb-5">
              <h3 className="text-uppercase text-success fw-bold pb-4 fs-3">your tour guides</h3>
              <div className="d-flex">
                <div className="d-flex pe-4">
                  <p className="fw-bold">LEAD GUIDE need to fix</p>

                </div>
                <p className="text-capitalize">{tour.difficulty}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 pb-5 ps-5 pe-5">
            <h3 className="text-uppercase text-success fw-bold pb-4 fs-3">about the park camper tour</h3>      
            <p>{tour.description}</p> 
          </div>
        </div>
      </div>
    </div>
  )
} 