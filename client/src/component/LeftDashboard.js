import { Link } from "react-router-dom";

export default function LeftDashboard() {
    return (
        <div className="bg-white bg-gradient shadow border-end shadow">
            <Link to="/" className="text-decoration-none text-success">
                <div className="text-center py-4 border-bottom left-dashboard">
                    <h3 className="text-uppercase fw-bold fs-4">Natours</h3>
                </div>
            </Link>
            <Link to="/admin/dashboard" className="d-flex align-items-center px-5 py-3 left-dashboard mt-4 text-decoration-none">
                <span className="material-symbols-outlined pe-2 text-success">dashboard</span>
                <h3 className="fs-5 text-success">Dashboard</h3>
            </Link>
            <Link to="/admin/users" className="d-flex align-items-center px-5 py-3 left-dashboard text-decoration-none">
                <span className="material-symbols-outlined pe-2 text-success">person</span>
                <h3 className="fs-5 text-success">User</h3>
            </Link>
            <Link to="/admin/tours" className="d-flex align-items-center px-5 py-3 left-dashboard text-decoration-none">
                <span className="material-symbols-outlined pe-2 text-success">flight</span>
                <h3 className="fs-5 text-success">Tours</h3>
            </Link>
            <Link to="/admin/reviews" className="d-flex align-items-center px-5 py-3 left-dashboard text-decoration-none">
                <span className="material-symbols-outlined pe-2 text-success">reviews</span>
                <h3 className="fs-5 text-success">Reviews</h3>
            </Link>
        </div>
    )
}