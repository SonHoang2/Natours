import { Link, useNavigate } from "react-router-dom";
import { USER_IMAGE_URL } from "../customValue";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const profileLink = () => {
    let url = '/user';
    if (user.role === "admin") url = url + '/admin'
    else if (user.role === "user") url = url + '/me'
    return url
  }

  return (
    <div className="bg-white d-flex px-3 py-1 justify-content-between w-100 align-items-center z-3 position-fixed shadow">
      <div>
        <Link to="/" className="text-decoration-none text-success">
          <p className="text-uppercase fw-bold fs-4">Natours</p>
        </Link>
      </div>
      {
        user === null ? 
        <div className="d-flex">
          <Link to="/user/login" className="text-decoration-none text-black me-2">
            <button className="btn text-uppercase p-3 me-1 fs-5">
              LOG IN
            </button>
          </Link>
          <Link to="/user/signup" className="text-decoration-none text-black">
            <button className="btn text-uppercase p-3 fs-5">
              SIGN UP
            </button>
          </Link>
        </div> :
        <div className="d-flex">
          <button 
            className="btn text-uppercase p-3 me-2 fs-5 text-black"
            onClick={() => {
              localStorage.removeItem("user")
              navigate("/")
            }}
          >
            LOG OUT
          </button>
          <Link 
            to={profileLink()} 
            className="text-decoration-none text-black"
          >
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