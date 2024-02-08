import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Card(props) {
  return (
    <div className="pt-4 col-12 col-md-6 col-lg-3 d-flex flex-column">
      <div className="card__image">
        <img
          className="w-100 h-100 opacity-75 object-fit-cover"
          crossorigin="anonymous" 
          src={process.env.REACT_APP_BASE_URL + "/images/tours/" + props.imageCover} 
          alt="tour image" 
        />
      </div>
      <div className="w-100 p-3">
        <p className="text-uppercase fw-bold opacity-75 mb-1">{`${props.difficulty} ${props.duration} days tours`}</p>
        <p className="fw-light">{props.summary}</p>
        <div className="row">
          <div className="col fw-light">
            <span>{props.startLocation.description}</span>
          </div>
          <div className="col fw-light">
            <span>{new Date(props.startDates[0]).toLocaleString('en-US', {month: "long", year: 'numeric'})}</span>
          </div>
        </div>
        <div className="row">
          <div className="col fw-light">
            <span>{props.locations.length + " stops"}</span>
          </div>
          <div className="col fw-light">
            <span>{props.maxGroupSize + " people"}</span>
          </div>
        </div>
      </div>
    </div>
  )  
}