import { Link } from "react-router-dom";
import { TOUR_IMAGE_URL } from "../customValue"

export default function Card(props) {
    return (
        <div className="col">
            <div className="shadow card h-100">
                <div className="h-300 w-100 position-relative">
                    <div className="position-absolute bg-success-gradient w-100 h-100 opacity-50 rounded-top z-2 "></div>
                    <div className="w-100 h-100">
                        <img
                            className="w-100 h-100 object-fit-cover card-img-top"
                            src={TOUR_IMAGE_URL + props.imageCover}
                            alt="tour"
                        />
                    </div>
                    <div className="position-absolute end-0 bottom-0 w-75 pe-3 pb-2 z-2 d-flex flex-column-reverse">
                        <p className="text-end">
                            <span className="text-white text-end text-uppercase fs-3 lh-base text-shadow bg-success-gradient p-2 box-decoration-break">{props.name}</span>
                        </p>
                    </div>
                </div>
                <div className="w-100 card-body">
                    <p className="text-uppercase fw-bold pb-2 fs-5 text-info">{`${props.difficulty} ${props.duration} days tours`}</p>
                    <p className="pb-3 lh-base">{props.summary}</p>
                    <div className="row">
                        <div className="col d-flex align-items-center pb-2 ">
                            <span className="material-symbols-outlined pe-2 text-success">location_on</span>
                            <span>{props.startLocation.name}</span>
                        </div>
                        <div className="col d-flex align-items-center pb-2 ">
                            <span className="material-symbols-outlined pe-2 text-success">calendar_month</span>
                            <span>{new Date(props.startDates[0]).toLocaleString('en-US', { month: "long", year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col d-flex align-items-center pb-2 ">
                            <span className="material-symbols-outlined pe-2 text-success">flag</span>
                            <span>{props.locations.length + " stops"}</span>
                        </div>
                        <div className="col d-flex align-items-center pb-2 ">
                            <span className="material-symbols-outlined pe-2 text-success">person</span>
                            <span>{props.maxGroupSize + " people"}</span>
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-secondary-subtle">
                    <div className="d-flex row">
                        <div className="d-flex flex-column col-6">
                            <div className="pb-2">
                                <span className="fw-bold text-success">${props.price}</span>
                                <span> per person</span>
                            </div>
                            <div>
                                <span className="fw-bold text-success">{props.ratingsAverage}</span>
                                <span> rating ({props.ratingsQuantity})</span>
                            </div>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <Link to={'/tour/' + props.slug}>
                                <button className="btn btn-warning px-5 py-2 rounded-pill text-white">DETAIL</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}