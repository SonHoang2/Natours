import { useEffect, useState } from "react";
import Header from "./component/Header"
import { TOUR_IMAGE_URL, USER_IMAGE_URL, TOURS_URL, BOOKINGS_URL } from "./customValue"
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Tour() {
    const userJSON = localStorage.getItem("user");
    const user = userJSON ? JSON.parse(userJSON) : null;

    const tokenJSON = localStorage.getItem("token");
    const token = tokenJSON ? JSON.parse(tokenJSON) : null;

    const { slug } = useParams();
    const [tour, setTour] = useState(null);

    const [reviews, setReviews] = useState({
        data: [],
        length: "",
        currentRatingLength: "",
        groupRating: [],
    });

    const [queryParams, setQueryParams] = useState({
        rating: "all",
        page: 1,
        limit: 3,
    });

    const navigate = useNavigate();

    const getCheckout = async () => {
        try {
            const url = BOOKINGS_URL + `/checkout-session/${tour.id}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            if (data.status === "success") {
                window.location.href = data.session.url
            }
        } catch (err) {
            console.log(err);
        }
    }

    const reviewStars = ratingStar => {
        const arr = []
        const remainStar = 5 - ratingStar

        for (let i = 0; i < ratingStar; i++) {
            arr.push((
                <span className="material-symbols-outlined review-star fill text-success">star</span>
            ))
        }
        for (let i = 0; i < remainStar; i++) {
            arr.push((
                <span className="material-symbols-outlined review-star text-success">star</span>
            ))
        }
        return arr
    }

    const ratingsAverageStars = ratingStar => {
        const arr = []
        const remainStar = 5 - Math.floor(ratingStar)

        for (let i = 0; i < Math.floor(ratingStar); i++) {
            arr.push((
                <div>
                    <span className="material-symbols-outlined ratings-average-star fill text-success">star</span>
                </div>
            ))
        }
        for (let i = 0; i < remainStar; i++) {
            arr.push((
                <div>
                    <span className="material-symbols-outlined ratings-average-star text-success">star</span>
                </div>
            ))
        }
        return arr
    }

    const navigateBefore = () =>
        setQueryParams(prev => {
            let obj = { ...prev };
            if (prev.page > 1) {
                obj = { ...prev, page: prev.page - 1 }
            }
            return obj;
        })

    const navigateAfter = () =>
        setQueryParams(prev => {
            let obj = { ...prev };
            if (prev.page < Math.ceil(reviews.currentRatingLength / prev.limit)) {
                obj = { ...prev, page: prev.page + 1 };
            }
            return obj;
        })

    useEffect(() => {
        const getTour = async () => {
            try {
                const tours = await axios.get(TOURS_URL + `/slug/${slug}`);

                setTour(tours.data.data.tour);
            } catch (err) {
                if (err.response.data.message === "Tour was deleted") {
                    alert("Tour was deleted");
                }
                else if (err.response.data.message === "No tour found with that name") {
                    navigate("/not-found")
                } else {
                    alert("Error getting tour");
                }
            }
        }
        getTour();
    }, [slug])

    console.log({ reviews });

    useEffect(() => {
        const getReviews = async () => {
            try {
                // only run if tour is available
                if (!tour) return;

                let reviews;

                if (queryParams.rating === "all") {
                    reviews = await axios.get(TOURS_URL + `/${tour._id}/reviews/?page=${queryParams.page}&limit=${queryParams.limit}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    reviews = await axios.get(TOURS_URL + `/${tour._id}/reviews/ratings/${queryParams.rating}?page=${queryParams.page}&limit=${queryParams.limit}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                setReviews(prev => ({
                    ...prev,
                    data: reviews.data.data.doc,
                    currentRatingLength: reviews.data.total
                }))

            } catch (err) {
                console.log(err);
                if (err.response?.data.message === "jwt malformed") {
                    navigate("/auth/login")
                }
            }
        }

        getReviews();

    }, [queryParams.page, tour?._id, queryParams.rating])

    useEffect(() => {
        const getRating = async () => {
            try {
                // only run if tour is available
                if (!tour) return;

                const groupRating = await axios.get(TOURS_URL + `/${tour._id}/reviews/group`, {
                    headers: { Authorization: `Bearer ${token}` }
                });


                const allRatings = [5, 4, 3, 2, 1];

                allRatings.forEach((rate) => {
                    // Check if the rating is already in the ratings array
                    if (!groupRating.data.data.ratings.some(r => r.rating === rate)) {
                        // If not present, add it with a count of 0
                        groupRating.data.data.ratings.push({ rating: rate, count: 0 });
                    }
                });

                groupRating.data.data.ratings.sort((a, b) => b.rating - a.rating);

                setReviews(prev => ({
                    ...prev,
                    length: groupRating.data.total,
                    currentRatingLength: groupRating.data.total,
                    groupRating: groupRating.data.data.ratings
                }))

            } catch (err) {
                console.log(err);
                if (err.response?.data.message === "jwt malformed") {
                    navigate("/auth/login")
                }
            }
        }

        getRating();
    }, [tour?._id])

    return (
        <div className="tour">
            <Header />
            {
                tour &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="d-flex justify-content-center h-900 position-relative">
                        <img
                            className="w-100 h-100 object-fit-cover"
                            src={TOUR_IMAGE_URL + tour.imageCover}
                            alt="tour"
                        />
                        <div className="position-absolute bg-success-gradient w-100 h-100 opacity-50">
                        </div>
                        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                            <div>
                                <h1 className="text-white text-uppercase fs-1 pb-3 fw-bold">{tour.name} Tour</h1>
                                <div className="d-flex justify-content-around">
                                    <div className="d-flex align-items-center">
                                        <span className="material-symbols-outlined text-white pe-2">schedule</span>
                                        <span className="text-white text-uppercase fw-bold">{tour.duration} days</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="material-symbols-outlined text-white pe-2">location_on</span>
                                        <span className="text-white text-uppercase fw-bold">{tour.startLocation.name} days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shadow px-5">
                        <div className="row m-0 pb-5">
                            <div className="col-lg-6 ps-0 pt-5">
                                <div className="pb-5">
                                    <h3 className="text-uppercase text-success fw-bold pb-5 fs-3">quick facts</h3>
                                    <div className="d-flex align-items-center pb-4 fs-5">
                                        <div className="d-flex pe-4 align-items-center">
                                            <span className="material-symbols-outlined pe-2 text-success">calendar_month</span>
                                            <p className="fw-bold">NEXT DATE</p>
                                        </div>
                                        <p>{new Date(tour.startDates[0]).toLocaleString('en-US', { month: "long", year: 'numeric' })}</p>
                                    </div>
                                    <div className="d-flex align-items-center pb-4 fs-5">
                                        <div className="d-flex align-items-center pe-4">
                                            <span className="material-symbols-outlined pe-2 text-success">trending_up</span>
                                            <p className="fw-bold">DIFFICULTY</p>
                                        </div>
                                        <p className="text-capitalize">{tour.difficulty}</p>
                                    </div>
                                    <div className="d-flex align-items-center pb-4 fs-5">
                                        <div className="d-flex align-items-center pe-4">
                                            <span className="material-symbols-outlined pe-2 text-success">person</span>
                                            <p className="fw-bold">PARTICIPANTS</p>
                                        </div>
                                        <p>{tour.maxGroupSize} People</p>
                                    </div>
                                    <div className="d-flex align-items-center pb-4 fs-5">
                                        <div className="d-flex align-items-center pe-4">
                                            <span className="material-symbols-outlined pe-2 text-success">star</span>
                                            <p className="fw-bold">RATING</p>
                                        </div>
                                        <p>{tour.ratingsAverage} / 5</p>
                                    </div>
                                </div>
                                <div className="pb-5">
                                    <h3 className="text-uppercase text-success fw-bold pb-5 fs-4">your tour guides</h3>
                                    <div className="d-flex flex-column">
                                        {
                                            tour.guides.map(guide => (
                                                <div className="d-flex align-items-center pb-3 fs-5" key={guide._id}>
                                                    <img className="user-avatar rounded-circle" src={USER_IMAGE_URL + guide.photo} alt="user avatar" />
                                                    <p className="ps-3 text-uppercase fw-bold">{guide.role}</p>
                                                    <p className="ps-3 text-capitalize">{guide.name}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 ps-0 pt-5">
                                <h3 className="text-uppercase text-success fw-bold pb-5 fs-4">about the park camper tour</h3>
                                <p className="lh-base fs-5">{tour.description}</p>
                            </div>
                        </div>
                        <div className="pb-5 timeline">
                            <p className="text-uppercase text-success fw-bold pb-5 fs-4">itinerary</p>
                            <div className="outer ms-5">
                                <div className="ps-4 pb-5">
                                    <p className="fs-5 fw-bold title pb-3">
                                        Day 0: {tour.startLocation.name}
                                    </p>
                                    <p className="fs-6 lh-base">
                                        {tour.startLocation.description}
                                    </p>
                                </div>
                                {tour.locations.map(location => (
                                    <div className="ps-4 pb-5" key={location._id}>
                                        <p className="fs-5 fw-bold title pb-3">
                                            Day {location.day}: {location.name}
                                        </p>
                                        <p className="fs-6 lh-base">
                                            {location.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="pb-5">
                            <p className="text-uppercase text-success fw-bold pb-5 fs-4">Tour Images</p>
                            <div className="d-flex ">
                                {
                                    tour.images.map(image => (
                                        <div className="h-500" key={image}>
                                            <img src={TOUR_IMAGE_URL + image} className="w-100 h-100 object-fit-cover" alt="tour" />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="pt-0">
                            <div className="pb-3 pt-5">
                                <span className="text-uppercase fw-bold fs-4 text-success">Product Ratings</span>
                            </div>
                            <div className="d-flex bg-white rounded shadow border mb-3">
                                <div className="p-4 me-3">
                                    <p className="fs-5 text-success ps-2 pb-2 text-nowrap">
                                        <span className="fs-4 fw-bold">{tour.ratingsAverage} </span> out of 5
                                    </p>
                                    <div className="d-flex">
                                        {
                                            ratingsAverageStars(tour.ratingsAverage)
                                        }

                                    </div>
                                </div>
                                <div className="p-3 ">
                                    <button
                                        className="group-rating fs-6 rounded border py-2 px-4 bg-white me-2 mb-2 "
                                        onClick={() => setQueryParams(prev => {
                                            // if the rating is different from current rating, reset the page to 1
                                            if (prev.rating !== "all") return { ...prev, rating: "all", page: 1 };

                                            return { ...prev, rating: "all" }
                                        })}
                                    >
                                        All ({reviews.length})
                                    </button>
                                    {
                                        reviews.groupRating.map(rating => (
                                            <button
                                                className="group-rating fs-6 rounded border py-2 px-4 bg-white me-2 mb-2 "
                                                key={rating.rating}
                                                onClick={() => setQueryParams(prev => {
                                                    // if the rating is different from current rating, reset the page to 1
                                                    if (prev.rating !== rating.rating) return { ...prev, rating: rating.rating, page: 1 };

                                                    return { ...prev, rating: rating.rating }
                                                })}
                                            >
                                                {rating.rating} Stars ({rating.count})
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    reviews.data.map(review => (
                                        <div
                                            className="bg-white rounded"
                                            key={review._id}
                                        >
                                            <div className="d-flex mb-4 p-4 shadow border rounded">
                                                <img
                                                    className="user-avatar rounded-circle"
                                                    src={USER_IMAGE_URL + review.user.photo}
                                                    alt="user avatar"
                                                />
                                                <div className="ps-3">
                                                    <p className="pb-2">{review.user.name}</p>
                                                    <div className="d-flex pb-2">
                                                        {reviewStars(review.rating)}
                                                    </div>
                                                    <p className="pb-4">{new Date(review.createAt).toLocaleString('en-US', {
                                                        year: '2-digit',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hourCycle: "h24"
                                                    })}
                                                    </p>
                                                    <p>
                                                        {review.review}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    reviews.currentRatingLength === 0 &&
                                    <div className="bg-white rounded p-4 shadow border mb-4">
                                        <p className="text-center">No ratings yet</p>
                                    </div>
                                }
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <span
                                    type="button"
                                    className="material-symbols-outlined fs-1"
                                    onClick={navigateBefore}
                                >
                                    navigate_before
                                </span>
                                <span type="button" className="bg-white p-2 fs-5">{queryParams.page}</span>
                                <span type="button"
                                    className="material-symbols-outlined fs-1"
                                    onClick={navigateAfter}
                                >
                                    navigate_next
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 d-flex justify-content-center pb-3">
                            <div className="shadow d-flex justify-content-between rounded p-5 flex-md-row flex-column">
                                <div className="pb-3 pe-md-3">
                                    <p className="text-success pb-2 fw-bold text-uppercase fs-5">What are you waiting for?</p>
                                    <p className="text-secondary">{tour.duration} days. 1 adventure. Infinite memories. Make it yours today!</p>
                                </div>
                                {
                                    user ?
                                        <div className="d-flex align-items-start justify-content-center">
                                            <button
                                                type="button"
                                                className="btn btn-warning py-2 px-4 rounded-pill text-white"
                                                onClick={getCheckout}
                                            >
                                                BOOK TOUR
                                            </button>
                                        </div> :
                                        <div className="d-flex align-items-start justify-content-center">
                                            <button
                                                type="button"
                                                className="btn btn-warning py-2 px-4 rounded-pill text-white"
                                                onClick={() => navigate("/auth/login")}
                                            >
                                                LOGIN TO BOOK TOUR
                                            </button>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </motion.div>
            }
        </div>
    )
} 