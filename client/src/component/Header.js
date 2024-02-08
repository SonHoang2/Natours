import {Link} from "react-router-dom";

export default function Header() {
  return (
    <nav className="bg-success d-flex p-4 space justify-content-between">
      <div>
        <Link to="/" className="text-decoration-none text-white">
          <h4 className="m-0">ALL TOURS</h4>
        </Link>
      </div>
      <div>
        <Link to="/user/login" className="text-decoration-none text-white">
          <h4 className="m-0">LOGIN</h4>
        </Link>
      </div>
    </nav>
  )
}