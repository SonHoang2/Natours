import { useState } from "react"
import Header from "./component/Header"
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);


export default function Dashboard() {
    const [bookingLineData, setBookingLineData] = useState(
        {
            labels: ["1", "7", "14", "21", "28", "30"],
            datasets: [
                {
                    label: "Current month",
                    data: [33, 53, 85, 41, 44, 65],
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                    lineTension: 0.5
                },
                {
                    label: "Past month",
                    data: [33, 25, 35, 51, 54, 76],
                    fill: false,
                    borderColor: "#742774",
                    lineTension: 0.5
                }
            ]
        })

    return (
        <div className="h-100">
            <Header />
            <div className="h-100 d-flex flex-column dashboard">
                <div className="pb-5"></div>
                <div className="pb-3"></div>
                <div className="d-flex h-100">
                    <div className="bg-success pt-4 shadow border-end">
                        <div className="d-flex align-items-center px-5 py-3">
                            <span className="material-symbols-outlined px-3 text-white">dashboard</span>
                            <h3 className="fs-5 text-white pe-3">Dashboard</h3>
                        </div>
                    </div>
                    <div className="px-4 py-5 bg-light w-100">
                        <div className="pb-3">
                            <h5 className="text-uppercase fs-6 text-muted pb-2 page-subtitle">Dashboard</h5>
                            <h3 className="fs-3 text-success">Blog Overview</h3>
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
                                        <h2 className="text-success fs-3 text-end">3 000</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            <span className="text-green">+55% </span>
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
                                        <h2 className="text-success fs-3 text-end">3 000</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            <span className="text-green">+55% </span>
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
                                        <h2 className="text-success fs-3 text-end">3 000</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            <span className="text-green">+55% </span>
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
                                        <h2 className="text-success fs-3 text-end">3 000</h2>
                                    </div>

                                    <div className="p-3 text-end">
                                        <p className="mb-0 text-secondary fs-5">
                                            <span className="text-green">+55% </span>
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
                            <div className="p-3 border-bottom border-top bg-light">
                                <div className="d-flex">
                                    <div className="pe-3">
                                        <label htmlFor="start-date" className="pe-3 text-secondary fs-5">Start Date</label>
                                        <input type="date" id="start-date" className="fs-5 p-3 rounded border-0 shadow-sm" />
                                    </div>
                                    <div className="pe-5">
                                        <label htmlFor="end-date" className="pe-3 text-secondary fs-5">End Date</label>
                                        <input type="date" id="end-date" className="fs-5 p-3 rounded border-0  shadow-sm" />
                                    </div>
                                    <button className="btn btn-success text-light px-4 fs-5">Search</button>
                                </div>
                            </div>
                            <div className="line-chart p-3">
                                <Line
                                    data={bookingLineData}
                                    options={
                                        {
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                },
                                                y: {
                                                    grid: {
                                                        display: true
                                                    }
                                                }
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