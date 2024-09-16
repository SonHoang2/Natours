import Header from "./component/Header"
import Card from "./component/Card"
import { useSearchParams, useNavigate } from "react-router-dom";
import { BOOKINGS_URL, TOUR_IMAGE_URL } from "./customValue"
import { useEffect, useState, useRef } from "react";
import { TOURS_URL } from "./customValue";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home({ tours, setTours }) {
    const tokenJSON = localStorage.getItem("token");
    const token = tokenJSON ? JSON.parse(localStorage.getItem("token")) : null;
    const searchInputRef = useRef(null);

    const [searchTour, setSearchTour] = useState({
        value: "",
        tours: []
    });

    // searchParams: tour after booking
    const [searchParams, setSearchParams] = useSearchParams();
    const [queryParams, setQueryParams] = useState({
        sort: "",
        limit: "8",
        page: 1,
    });
    const navigate = useNavigate();

    const getTours = async () => {
        try {
            const url = TOURS_URL + `/?sort=${queryParams.sort}&limit=${queryParams.limit}&page=${queryParams.page}`;
            const res = await fetch(url, {
                method: "GET",
            })
            const data = await res.json();
            if (data.data) {
                setTours(prev => {
                    const obj = {
                        ...prev,
                        data: data.data.doc,
                        length: data.total
                    };
                    
                    return obj
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // get nearby tours
    const getNearByTours = async () => {
        const success = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            alert(`Latitude: ${latitude}, Longitude: ${longitude}`);

        }

        const error = () => {
            alert("Unable to retrieve your location");
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Geolocation not supported");
        }
    }

    const cards = () => {
        return tours.data.map((tour, i) => (
            <Card
                key={i}
                {...tour}
            />
        ))
    }

    const booking = async () => {
        try {
            const tour = searchParams.get("tour");
            const user = searchParams.get("user");
            const price = searchParams.get("price");

            const url = BOOKINGS_URL + "/checkout-session/";
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ tour, user, price }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            const data = await res.json();
        } catch (err) {
            console.log(err);
        }
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
            if (prev.page < Math.ceil(tours.length / prev.limit)) {
                obj = { ...prev, page: prev.page + 1 };
            }
            return obj;
        })

    function useOutsideAlerter(ref) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setSearchTour(prev => ({ ...prev, tours: [] }));
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    useOutsideAlerter(searchInputRef);

    // only get tour after 500ms user stop typing
    function useDebounce(cb, delay) {
        try {
            useEffect(() => {
                // return if search is empty
                if (cb === "") return;

                const handler = setTimeout(async () => {
                    const tours = await axios.get(TOURS_URL + `/search/${cb}`);
                    setSearchTour(prev => ({ ...prev, tours: tours.data.data.tours }));

                }, delay);

                return () => {
                    clearTimeout(handler);
                };
            }, [cb, delay]);
            return searchTour.tours;

        } catch (err) {
            console.log(err);
        }
    }
    
    useDebounce(searchTour.value, 500);

    useEffect(() => {
        // booking success
        if (searchParams.size === 3) {
            booking();
            setSearchParams("");
            alert("thank you for booking");
        };
    }, [searchParams.size])

    useEffect(() => {
        getTours();
    }, [queryParams.sort, queryParams.page])

    return (
        <div>
            <Header />
            <div className="pb-5"></div>
            <div className="pb-5"></div>
            <motion.div
                className="container-fluid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="mb-4 d-flex justify-content-center">
                    <div className="position-relative w-50">
                        <div ref={searchInputRef}>
                            <input
                                type="text"
                                className="form-control shadow-none rounded-pill shadow"
                                placeholder="Search tour..."
                                value={searchTour.value}
                                onChange={(e) => setSearchTour(prev => ({ ...prev, value: e.target.value }))}
                            />
                            {
                                Boolean(searchTour.tours.length) &&
                                <div
                                    className="position-absolute w-100 mt-1 rounded bg-white border shadow z-3"
                                >
                                    {/* <div
                                        className="d-flex align-items-center p-3 search-item"
                                        onClick={() => getNearByTours()}
                                    >
                                        <div className="p-2 border rounded bg-light">
                                            <span className="material-symbols-outlined">
                                                near_me
                                            </span>
                                        </div>
                                        <p className="fw-bold ms-3">
                                            Nearby
                                        </p>
                                    </div> */}
                                    {
                                        searchTour.tours?.map((tour, i) => (
                                            <div
                                                key={i}
                                                className="d-flex align-items-center p-3 search-item"
                                                onClick={() => navigate(tour.slug)}
                                            >
                                                <div>
                                                    <img
                                                        src={TOUR_IMAGE_URL + tour.imageCover}
                                                        alt="tour"
                                                        className="rounded"
                                                        style={{ width: "50px", height: "50px" }}
                                                    />
                                                </div>
                                                <p className="fw-bold ms-3">
                                                    {tour.name}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="bg-secondary-subtle shadow p-3 mb-4 rounded d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <p className="p-2 pe-4">Sort by</p>
                        <button
                            className="btn btn-light me-3"
                            onClick={() => setQueryParams(prev => ({ ...prev, sort: "-ratingsQuantity" }))}
                        >
                            Popular</button>
                        <button
                            className="btn btn-light me-3"
                            onClick={() => setQueryParams(prev => ({ ...prev, sort: "-createAt" }))}
                        >
                            Latest
                        </button>
                        <button
                            className="btn btn-light me-3"
                            onClick={() => setQueryParams(prev => ({ ...prev, sort: "price" }))}
                        >
                            Price: Low to High
                        </button>
                        <button
                            className="btn btn-light me-3"
                            onClick={() => setQueryParams(prev => ({ ...prev, sort: "-price" }))}
                        >
                            Price: High to Low
                        </button>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p type="button" className="p-2 fs-5">
                            <span className="text-success">{queryParams.page}</span>/{Math.ceil(tours.length / queryParams.limit)}
                        </p>
                        <p
                            type="button"
                            className="material-symbols-outlined bg-light rounded-1 text-black fs-1"
                            onClick={navigateBefore}
                        >
                            navigate_before
                        </p>
                        <p type="button"
                            className="material-symbols-outlined bg-light rounded-1 text-black fs-1"
                            onClick={navigateAfter}
                        >
                            navigate_next
                        </p>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                    {cards()}
                </div>
            </motion.div >
        </div >
    )
}