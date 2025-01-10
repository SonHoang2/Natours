import axios from "axios";
import LeftDashboard from "../component/LeftDashboard";
import { useEffect, useState } from "react";
import { REVIEWS_URL  } from "../customValue";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminEditReviewPage() {
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

    const { state } = useLocation()


    const [review, setReview] = useState({
        review: state.review,
        rating: state.rating,
    });

    const updateReview = async (e) => {
        e.preventDefault();

        try {
            const updatedReview = await axios.patch(REVIEWS_URL + `/${state._id}`, review, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(updatedReview.data);

            navigate("/admin/reviews");
        }
        catch (error) {
            alert("Error updating review");
            console.error(error);
        }
    }

    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex h-100">
                    <LeftDashboard />
                    <div className="px-4 py-5 bg-light w-100">
                        <div className="bg-white w-100 shadow border mt-5">
                            <h1 className="p-3 bg-light">Edit Tour</h1>
                            <div className="p-3">
                                <form onSubmit={updateReview}>
                                    <div className="mb-3">
                                        <label htmlFor="review" className="form-label">Review</label>
                                        <textarea
                                            className="form-control"
                                            id="review"
                                            value={review.review}
                                            onChange={(e) => setReview({ ...review, review: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="rating" className="form-label">Rating</label>
                                        <select 
                                            className="form-select"
                                            id="rating"
                                            value={review.rating}
                                            onChange={(e) => setReview({ ...review, rating: e.target.value })}
                                        > 
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary text-end">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}