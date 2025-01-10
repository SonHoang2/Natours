import { useNavigate } from "react-router-dom";
import Header from "../component/Header";

export default function ErrorPage() {
    const navigate = useNavigate();
    return (
        <div className="error-page">
            <Header />
            <div className="pt-5" />
            <div className="container d-flex align-items-center flex-column">
                <h3 className="text-center">The Page You Requested Could Not Be Found</h3>
                <div className="pt-5">
                    <img className="w-100" src="./img/404.png" alt="404" />
                </div>
                <h4 className="pt-5 pb-4 text-center">We searched high and low but couldn’t find what you’re looking for. Let’s find a better place for you to go.</h4>
                <button
                    type="button"
                    className="btn btn-success text-white"
                    onClick={() => navigate("/")}
                >
                    GO TO HOMEPAGE
                </button>
            </div>
            <div className="pt-5" />
        </div>
    )
}