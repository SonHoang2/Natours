import { Link } from 'react-router-dom';

export default function LeftUserSetting({ role }) {
    return (
        <div className="bg-success py-4 w-400 rounded-start">
            <Link to="/user/me" className="text-decoration-none">
                <div className="d-flex align-items-center p-4 left-user-setting">
                    <span className="material-symbols-outlined pe-3 text-white left-user-setting-item">settings</span>
                    <p className="text-white left-user-setting-item">SETTINGS</p>
                </div>
            </Link>
            <Link to="/user/my-bookings" className="text-decoration-none">
                <div className="d-flex align-items-center p-4 left-user-setting">
                    <span className="material-symbols-outlined pe-3 text-white left-user-setting-item">work</span>
                    <p className="text-white left-user-setting-item">MY BOOKINGS</p>
                </div>
            </Link>
            <Link to="/user/my-reviews" className="text-decoration-none">
                <div className="d-flex align-items-center p-4 left-user-setting">
                    <span className="material-symbols-outlined pe-3 text-white left-user-setting-item">star</span>
                    <p className="text-white left-user-setting-item">MY REVIEWS</p>
                </div>
            </Link>
            {
                role === "admin" &&
                <Link to="/admin/dashboard" className="text-decoration-none">
                    <div className="d-flex align-items-center p-4 left-user-setting">
                        <span className="material-symbols-outlined pe-3 text-white left-user-setting-item">dashboard</span>
                        <p className="text-white left-user-setting-item">DASHBOARD</p>
                    </div>
                </Link>
            }
        </div>
    )
}