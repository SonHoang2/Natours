import axios from "axios";
import LeftDashboard from "./component/LeftDashboard";
import { useEffect, useState } from "react";
import { REVIEWS_URL, USER_IMAGE_URL } from "./customValue";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AdminReviewPage() {
    const userJSON = localStorage.getItem("user");
    const account = userJSON ? JSON.parse(userJSON) : null;

    const tokenJSON = localStorage.getItem("token");
    const token = tokenJSON ? JSON.parse(tokenJSON) : null;

    const navigate = useNavigate();

    useEffect(() => {
        if (!account || account.role !== "admin") {
            navigate("/not-found");
        }
    }, []);


    const [reviews, setReviews] = useState({
        data: [],
        totalLength: 0,
        currentLength: 0,
    });

    const [userQueryParams, setUserQueryParams] = useState({
        limit: 5,
        page: 1,
        sort: "-createdAt,name",
    });

    const getReviews = async () => {
        try {
            const reviews = await axios.get(REVIEWS_URL + `/?limit=${userQueryParams.limit}&sort=${userQueryParams.sort}&page=${userQueryParams.page}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                });

            console.log(reviews.data);

            let currentLength = userQueryParams.limit * userQueryParams.page;

            if (currentLength > reviews.data.total) {
                currentLength = reviews.data.total;
            }

            setReviews({
                data: reviews.data.data.doc,
                totalLength: reviews.data.total,
                currentLength: currentLength
            });

        } catch (error) {
            alert("Error getting users");
            console.error(error);
        }
    }

    const deleteReview = async (id) => {
        try {
            const user = await axios.delete(REVIEWS_URL + `/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(user.data);

            getReviews();
        }
        catch (error) {
            alert("Error deleting user");
            console.error(error);
        }
    }


    const navigateBefore = () =>
        setUserQueryParams(prev => {
            let obj = { ...prev };
            if (prev.page > 1) {
                obj = { ...prev, page: prev.page - 1 }
            }
            return obj;
        })

    const navigateAfter = () =>
        setUserQueryParams(prev => {
            let obj = { ...prev };
            if (prev.page < Math.ceil(reviews.totalLength / prev.limit)) {
                obj = { ...prev, page: prev.page + 1 };
            }
            return obj;
        })

    useEffect(() => {
        getReviews();
    }, [userQueryParams.page]);

    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex h-100">
                    <LeftDashboard />
                    <div className="px-4 py-5 bg-light w-100">
                        <div className="pb-5">
                            <h5 className="text-uppercase fs-6 text-muted pb-2 page-subtitle">Overview</h5>
                            <h3 className="fs-3 text-success">Reviews</h3>
                        </div>
                        <table className="bg-white w-100 shadow border ">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="p-3 text-capitalize">Avatar</th>
                                    <th className="p-3 text-capitalize">name</th>
                                    <th className="p-3 text-capitalize">tour</th>
                                    <th className="p-3 text-capitalize">review</th>
                                    <th className="p-3 text-capitalize">rating</th>
                                    <th className="p-3 text-capitalize">createdAt</th>
                                    <th className="p-3 text-capitalize">Edit</th>
                                    <th className="p-3 text-capitalize">Delete</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    reviews.data.map((review) => (
                                        <tr key={review._id}>
                                            <td className="p-3 align-middle">
                                                <img
                                                    className="rounded-circle user-avatar"
                                                    src={USER_IMAGE_URL + review.user.photo}
                                                    alt="user"
                                                />
                                            </td>
                                            <td className="p-3 align-middle">{review.user.name}</td>
                                            <td className="p-3 align-middle">{review.tour.name}</td>
                                            <td className="p-3 align-middle">{review.review}</td>
                                            <td className="p-3 align-middle">{review.rating}</td>
                                            <td className="p-3 align-middle">
                                                {new Date(review.createdAt).toLocaleString('en-GB', { day: "numeric", month: "2-digit", year: 'numeric' })}
                                            </td>
                                            <td className="p-3 align-middle">
                                                <Link
                                                    to={`./edit`}
                                                    state={review}
                                                    className="material-symbols-outlined text-primary p-2 bg-white rounded border-0 text-decoration-none"
                                                >
                                                    edit
                                                </Link>
                                            </td>
                                            <td className="p-3 align-middle">
                                                <button
                                                    className="material-symbols-outlined text-danger p-2 bg-white rounded border-0"
                                                    onClick={() => deleteReview(review._id)}
                                                >
                                                    delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="7" className="p-3">
                                        <div className="d-flex justify-content-center ">
                                            <div className="position-relative d-flex align-items-center">
                                                <h1 className="navigate-button text-secondary">
                                                    {reviews.currentLength} of {reviews.totalLength} result
                                                </h1>
                                                <span
                                                    type="button"
                                                    className="material-symbols-outlined fs-1 position-relative"
                                                    onClick={navigateBefore}
                                                >
                                                    navigate_before
                                                </span>
                                                <span type="button" className="bg-white p-2 fs-5">{userQueryParams.page}</span>
                                                <span type="button"
                                                    className="material-symbols-outlined fs-1"
                                                    onClick={navigateAfter}
                                                >
                                                    navigate_next
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
} 