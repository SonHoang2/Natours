import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TOUR_IMAGE_URL } from "../customValue"

export default function Card(props) {
  return (
    <div className="mt-4 col-12 col-md-6 col-lg-3">
      <div className="d-flex flex-column shadow">
        <div className="h-300 w-100 position-relative">
          <div className="position-absolute bg-success w-100 h-100 opacity-50 rounded-top"></div>
          <img
            className="w-100 h-100 object-fit-cover rounded-top"
            src={TOUR_IMAGE_URL + props.imageCover} 
            alt="tour image" 
          />
          <h3 className="position-absolute end-0 bottom-0 w-50 d-flex flex-row-reverse pe-3">
            <span className="text-white text-end p-3 text-uppercase fs-4">{props.name}</span>
          </h3>
        </div>
        <div className="w-100 p-3">
          <p className="text-uppercase fw-bold pb-2 fs-6">{`${props.difficulty} ${props.duration} days tours`}</p>
          <p className="fw-light pb-3 lh-sm">{props.summary}</p>
          <div className="row">
            <div className="col fw-light d-flex align-items-center pb-2 ">
              <span className="material-symbols-outlined pe-2 text-success">location_on</span>
              <span>{props.startLocation.description}</span>
            </div>
            <div className="col fw-light d-flex align-items-center pb-2 ">
              <span className="material-symbols-outlined pe-2 text-success">calendar_month</span>
              <span>{new Date(props.startDates[0]).toLocaleString('en-US', {month: "long", year: 'numeric'})}</span>
            </div>
          </div>
          <div className="row">
            <div className="col fw-light d-flex align-items-center pb-2 ">
              <span className="material-symbols-outlined pe-2 text-success">flag</span>
              <span>{props.locations.length + " stops"}</span>
            </div>
            <div className="col fw-light d-flex align-items-center pb-2 ">
              <span className="material-symbols-outlined pe-2 text-success">person</span>
              <span>{props.maxGroupSize + " people"}</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-secondary-subtle">
          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <div className="pb-2">
                <span className="fw-bold">${props.price}</span>
                <span> per person</span>
              </div>
              <div>
                <span className="fw-bold">{props.ratingsAverage}</span>
                <span> rating ({props.ratingsQuantity})</span>
              </div>
            </div>
            <div className="col-6">
              <Link to={'/tour/' + props.slug}>
                <button className="btn btn-success w-100 h-100">DETAIL</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )  
}