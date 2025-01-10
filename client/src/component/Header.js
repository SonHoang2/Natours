import { Link, useNavigate } from "react-router-dom";
import { USER_IMAGE_URL } from "../customValue";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
    const { user } = useAuth();
    console.log(user);
    
    const navigate = useNavigate();

    return (
        <div className="bg-white d-flex px-3 py-1 justify-content-between w-100 align-items-center z-3 position-fixed border-bottom">
            <div>
                <Link to="/" className="text-decoration-none text-success">
                    <p className="text-uppercase fw-bold fs-4">Natours</p>
                </Link>
            </div>
            {
                user === null ?
                    <div className="d-flex">
                        <Link to="/auth/login" className="text-decoration-none text-black me-2">
                            <button className="btn text-uppercase p-3 me-1 fs-5">
                                LOG IN
                            </button>
                        </Link>
                        <Link to="/auth/signup" className="text-decoration-none text-black">
                            <button className="btn text-uppercase p-3 fs-5">
                                SIGN UP
                            </button>
                        </Link>
                    </div> :
                    <div className="d-flex">
                        <button
                            className="btn text-uppercase p-3 me-2 fs-5 text-black"
                            onClick={() => {
                                // localStorage.removeItem("user")
                                // localStorage.removeItem("token")
                                navigate("/")
                            }}
                        >
                            LOG OUT
                        </button>
                        <Link
                            to="/user/me"
                            className="text-decoration-none text-black"
                        >
                            <div className="d-flex align-items-center h-100">
                                <div className="d-flex align-items-center h-100">
                                    <img
                                        className="rounded-circle user-avatar"
                                        src={USER_IMAGE_URL + user?.photo}
                                    />
                                </div>
                                <p className="ps-2 fs-5 text-uppercase">{user.name?.split(' ')[0]}</p>
                            </div>
                        </Link>
                    </div>
            }
        </div>
    )
}