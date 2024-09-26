import { useNavigate } from "react-router-dom";

export default function ThankForBooking() {
    const navigate = useNavigate();
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-dark">
            <h1 className="display-3 mb-3">Thank you for booking</h1>
            <p className="lead pb-5">Your booking has been confirmed.</p>
            <button
                type="button"
                className="btn btn-success text-white"
                onClick={() => navigate("/")}
            >
                GO TO HOMEPAGE
            </button>
        </div>

    );
}