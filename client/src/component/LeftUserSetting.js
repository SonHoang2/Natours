import { Link } from 'react-router-dom';

export default function LeftUserSetting({ role }) {
    return (
        <div className="bg-success p-5 w-400 rounded-start">
            <Link to="/user/me" className="text-decoration-none">
                <div className="d-flex align-items-center pb-4">
                    <span className="material-symbols-outlined pe-3 text-white">settings</span>
                    <p className="text-white">SETTINGS</p>
                </div>
            </Link>
            <Link to="/user/my-bookings" className="text-decoration-none">
                <div className="d-flex align-items-center pb-4">
                    <span className="material-symbols-outlined pe-3 text-white">work</span>
                    <p className="text-white">MY BOOKINGS</p>
                </div>
            </Link>
            <Link to="/user/my-reviews" className="text-decoration-none">
                <div className="d-flex align-items-center pb-4">
                    <span className="material-symbols-outlined pe-3 text-white">star</span>
                    <p className="text-white">MY REVIEWS</p>
                </div>
            </Link>
            {
                role === "admin" &&
                <Link to="/dashboard" className="text-decoration-none">
                    <div className="d-flex align-items-center pb-4">
                        <span className="material-symbols-outlined pe-3 text-white">dashboard</span>
                        <p className="text-white">DASHBOARD</p>
                    </div>
                </Link>
            }
        </div>
    )
}