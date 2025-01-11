import axios from "axios";
import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import LeftDashboard from "../component/LeftDashboard";
import { BOOKINGS_URL, REVIEWS_URL, TOURS_URL } from "../customValue";

Chart.register(CategoryScale);

export default function Dashboard() {
    const [tourComparison, setTourComparison] = useState({})
    const [userComparison, setUserComparison] = useState({})
    const [reviewComparison, setReviewComparison] = useState({})
    const [bookingComparison, setBookingComparison] = useState({})
    const [bookingSale, setBookingSale] = useState({
        currentMonth: [],
        lastMonth: []
    })

    const bookingLineData = {
        labels: ["7", "14", "21", "28", "last day"],
        datasets: [
            {
                label: "Current Month",
                data: bookingSale.currentMonth.map(item => item.totalMoney),
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "#3399ff",
                lineTension: 0.5
            },
            {
                label: "Last Month",
                data: bookingSale.lastMonth.map(item => item.totalMoney),
                fill: false,
                borderColor: "#34a853",
                lineTension: 0.5
            }
        ]
    }

    const getBookingLineData = async () => {
        try {
            const bookingLine = await axios.get(BOOKINGS_URL + `/comparison/last-current-month/detail`, {
                withCredentials: true,
            });

            setBookingSale({
                currentMonth: bookingLine.data.data.currentMonth,
                lastMonth: bookingLine.data.data.lastMonth
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getTourComparison = async () => {
        try {
            const tour = await axios.get(TOURS_URL + '/comparison/last-current-month', {
                withCredentials: true
            });
            setTourComparison(tour.data.data)
        } catch (error) {
            console.log(error)

        }
    }

    const getUserComparison = async () => {
        try {
            const user = await axios.get(TOURS_URL + '/comparison/last-current-month',
                { withCredentials: true }
            );
            setUserComparison(user.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getReviewComparison = async () => {
        try {
            const review = await axios.get(REVIEWS_URL + '/comparison/last-current-month',
                { withCredentials: true }
            );
            setReviewComparison(review.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getBookingComparison = async () => {
        try {
            const booking = await axios.get(BOOKINGS_URL + '/comparison/last-current-month',
                { withCredentials: true }
            );
            setBookingComparison(booking.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    const comparerison = (doc) => {
        // if last month is 0, then return 1 to avoid infinity
        const divisor = doc.lastMonthTotal === 0 ? 1 : doc.lastMonthTotal;

        if (doc.thisMonthTotal - doc.lastMonthTotal > 0) {
            return (
                <span className="text-green pe-1">
                    +{(doc.thisMonthTotal - doc.lastMonthTotal) / divisor * 100}%
                </span>
            )
        }
        return (
            <span className="text-danger pe-1">
                {(doc.thisMonthTotal - doc.lastMonthTotal) / divisor * 100}%
            </span>
        )
    }

    useEffect(() => {
        const userJSON = localStorage.getItem("user");
        const user = userJSON ? JSON.parse(userJSON) : null;

        if (user === null) {
            window.location.href = "/auth/login"
        }
    }, [])

    useEffect(() => {
        getTourComparison();
        getUserComparison();
        getReviewComparison();
        getBookingComparison();
        getBookingLineData();
    }, [])

    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column dashboard">
                <div className="d-flex h-100">
                    <LeftDashboard />
                    <div className="px-4 py-5 bg-light w-100 overflow-auto">
                        <div className="pb-5">
                            <h5 className="text-uppercase fs-6 text-muted pb-2 page-subtitle">Admin</h5>
                            <h3 className="fs-3 text-success">Dashboard</h3>
                        </div>
                        <div className="mt-4 mb-5">
                            <div className="row">
                                <div className="bg-white shadow px-0 mx-2 col card">
                                    <div className="p-4 bg-gradient-green position-absolute rounded card-icon">
                                        <span className="material-symbols-outlined text-white">
                                            flight
                                        </span>
                                    </div>
                                    <div className="py-3 pe-3 border-bottom">
                                        <h3 className="pb-3 text-end text-secondary fs-5">Tours</h3>
                                        <h2 className="text-success fs-3 text-end">{tourComparison.thisMonthTotal}</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            {comparerison(tourComparison)}
                                            than last month
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white shadow px-0 mx-2 col card">
                                    <div className="p-4 bg-gradient-blue position-absolute rounded card-icon">
                                        <span className="material-symbols-outlined text-white">
                                            person
                                        </span>
                                    </div>
                                    <div className="py-3  pe-3 border-bottom">
                                        <h3 className="pb-3 text-end text-secondary fs-5">Users</h3>
                                        <h2 className="text-success fs-3 text-end">{userComparison.thisMonthTotal}</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            {comparerison(userComparison)}
                                            than last month
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white shadow px-0 mx-2 col card">
                                    <div className="p-4 bg-gradient-pink position-absolute rounded card-icon">
                                        <span className="material-symbols-outlined text-white">
                                            reviews
                                        </span>
                                    </div>
                                    <div className="py-3  pe-3 border-bottom">
                                        <h3 className="pb-3 text-end text-secondary fs-5">Reviews</h3>
                                        <h2 className="text-success fs-3 text-end">{reviewComparison.thisMonthTotal}</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            {comparerison(reviewComparison)}
                                            than last month
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white shadow px-0 mx-2 col card">
                                    <div className="p-4 bg-gradient-purple position-absolute rounded card-icon">
                                        <span className="material-symbols-outlined text-white">
                                            credit_card
                                        </span>
                                    </div>
                                    <div className="py-3  pe-3 border-bottom">
                                        <h3 className="pb-3 text-end text-secondary fs-5">Bookings</h3>
                                        <h2 className="text-success fs-3 text-end">{bookingComparison.thisMonthTotal}</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            {comparerison(bookingComparison)}
                                            than last month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shadow bg-white rounded">
                            <div className="p-3">
                                <h1 className="text-success fs-4">Bookings</h1>
                            </div>
                            {/* <div className="p-3 border-bottom border-top bg-light">
                                <div className="d-flex justify-content-end">
                                    <button className="pe-3 btn btn-success text-white">
                                        month
                                    </button>
                                </div>
                            </div> */}
                            <div className="line-chart p-3">
                                <Line
                                    data={bookingLineData}
                                    options={
                                        {
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false
                                                    },
                                                    ticks: {
                                                        callback: function (value, index, values) {
                                                            // Check if it's the last label (index of the label array)
                                                            if (index === values.length - 1) {
                                                                return ''; // Hide the last label (e.g., "30")
                                                            }
                                                            return this.getLabelForValue(value); // Return other labels
                                                        }
                                                    }
                                                },
                                                y: {
                                                    grid: {
                                                        display: true
                                                    },
                                                    ticks: {
                                                        callback: function (value) {
                                                            return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
                                                        }
                                                    }
                                                },
                                            },
                                            devicePixelRatio: 3,
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        // This more specific font property overrides the global property
                                                        font: {
                                                            size: 16,
                                                            family: 'sans-serif',
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}