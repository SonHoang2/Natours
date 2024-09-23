import { Link } from "react-router-dom";
import { TOUR_IMAGE_URL } from "../customValue"

export default function BookingCard({ booking }) {
    return (
        <div className="pb-3 d-flex justify-content-between">
            <div className="d-flex">
                <div className="tour-image--sm">
                    <img
                        src={TOUR_IMAGE_URL + booking.tour.imageCover}
                        className="w-100 h-100 rounded"
                    />
                </div>
                <div className="ps-3">
                    <p className="pb-2 fw-bold text-info">{booking.tour.name}</p>
                    <p className="pb-2 text-secondary">
                        {new Date(booking.createdAt).toLocaleString('en-US', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: "h24"
                        })}
                    </p>
                    <p className="text-success">${booking.price}</p>
                </div>
            </div>
            <Link to={'/tour/' + booking.tour.slug}>
                <button className="btn btn-warning text-white">DETAIL</button>
            </Link>
        </div>
    )
}