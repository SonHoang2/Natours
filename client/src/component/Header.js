import { Link, useNavigate } from "react-router-dom";
import { USER_IMAGE_URL } from "../customValue";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  return (
    <div className="bg-dark d-flex px-3 py-1 justify-content-between w-100 align-items-center z-3 position-fixed">
      <div>
        <Link to="/" className="text-decoration-none text-white">
          <p className="text-uppercase fw-light fs-5">Natours</p>
        </Link>
      </div>
      {
        user === null ? 
        <div className="d-flex">
          <Link to="/user/login" className="text-decoration-none text-white me-2">
            <button className="btn btn-dark text-uppercase p-3 me-1 fs-5 fw-light">
              LOG IN
            </button>
          </Link>
          <Link to="/user/signup" className="text-decoration-none text-white">
            <button className="btn btn-dark text-uppercase p-3 fs-5 fw-light">
              SIGN UP
            </button>
          </Link>
        </div> :
        <div className="d-flex fw-light">
          <button 
            className="btn btn-dark text-uppercase p-3 me-2 fs-5 fw-light"
            onClick={() => {
              localStorage.removeItem("user")
              navigate("/")
            }}
          >
            LOG OUT
          </button>
          <Link to="/user/me" className="text-decoration-none text-white">
            <div className="d-flex align-items-center h-100">
              <div className="d-flex align-items-center h-100">
                <img 
                  className="rounded-circle user-avatar"
                  src={USER_IMAGE_URL + user.photo} 
                />
              </div>
              <p className="ps-2 fs-5 text-uppercase">{user.name.split(' ')[0]}</p>
            </div>
          </Link>
        </div>
      }
    </div>
  )
}