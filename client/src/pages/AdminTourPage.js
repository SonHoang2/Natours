import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LeftDashboard from "../component/LeftDashboard";
import { TOUR_IMAGE_URL, TOURS_URL } from "../customValue";

export default function AdminTourPage() {

    const [tours, setTours] = useState(
        {
            data: [],
            totalLength: 0,
            currentLength: 0
        }
    );

    const [tourQueryParams, setTourQueryParams] = useState({
        limit: 5,
        page: 1,
        sort: "-createdAt",
    });

    const getTours = async () => {
        try {
            const tours = await axios.get(TOURS_URL + `/?limit=${tourQueryParams.limit}&sort=${tourQueryParams.sort}&page=${tourQueryParams.page}`,
                {
                    withCredentials: true,
                });

            console.log(tours.data);

            let currentLength = tourQueryParams.limit * tourQueryParams.page;

            if (currentLength > tours.data.total) {
                currentLength = tours.data.total;
            }

            setTours({
                data: tours.data.data.doc,
                totalLength: tours.data.total,
                currentLength: currentLength
            });

        } catch (error) {
            alert("Error getting tours");
            console.error(error);
        }
    }

    const deleteTour = async (id) => {
        try {
            const tour = await axios.patch(TOURS_URL + `/${id}`, { active: false }, {
                withCredentials: true,
            });

            console.log(tour.data);
            
            getTours();
        } catch (error) {
            alert("Error deleting tour");
            console.error(error);
        }
    }

    const navigateBefore = () =>
        setTourQueryParams(prev => {
            let obj = { ...prev };
            if (prev.page > 1) {
                obj = { ...prev, page: prev.page - 1 }
            }
            return obj;
        })

    const navigateAfter = () =>
        setTourQueryParams(prev => {
            let obj = { ...prev };
            if (prev.page < Math.ceil(tours.totalLength / prev.limit)) {
                obj = { ...prev, page: prev.page + 1 };
            }
            return obj;
        })

    useEffect(() => {
        getTours();
    }, [tourQueryParams.page]);

    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex h-100">
                    <LeftDashboard />
                    <div className="px-4 py-5 bg-light w-100">
                        <div className="pb-5">
                            <h5 className="text-uppercase fs-6 text-muted pb-2 page-subtitle">Overview</h5>
                            <h3 className="fs-3 text-success">Tours</h3>
                        </div>
                        <table className="bg-white w-100 shadow border ">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="p-3 text-capitalize">image cover</th>
                                    <th className="p-3 text-capitalize">name</th>
                                    <th className="p-3 text-capitalize">max Group Size</th>
                                    <th className="p-3 text-capitalize">price</th>
                                    <th className="p-3 text-capitalize">created at</th>
                                    <th className="p-3 text-capitalize">active</th>
                                    <th className="p-3 text-capitalize">edit</th>
                                    <th className="p-3 text-capitalize">delete</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    tours.data.map((tour) => (
                                        <tr key={tour._id}>
                                            <td className="p-3 align-middle">
                                                <img
                                                    className="rounded-circle user-avatar"
                                                    src={TOUR_IMAGE_URL + tour.imageCover}
                                                    alt="tour" />
                                            </td>
                                            <td className="p-3 align-middle">{tour.name}</td>
                                            <td className="p-3 align-middle">{tour.maxGroupSize}</td>
                                            <td className="p-3 align-middle">{tour.price}</td>
                                            <td className="p-3 align-middle">
                                                {new Date(tour.startDates[0]).toLocaleString('en-GB', { day: "numeric", month: "2-digit", year: 'numeric' })}
                                            </td>
                                            <td className="p-3 align-middle">{tour.active ? "true" : "false"}</td>
                                            <td className="p-3 align-middle">
                                                <Link
                                                    to={`./edit`}
                                                    state={tour}
                                                    className="material-symbols-outlined text-primary p-2 bg-white rounded border-0 text-decoration-none"
                                                >
                                                    edit
                                                </Link>
                                            </td>
                                            <td className="p-3 align-middle">
                                                <button
                                                    className="material-symbols-outlined text-danger p-2 bg-white rounded border-0"
                                                    onClick={() => deleteTour(tour._id)}
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
                                                    {tours.currentLength} of {tours.totalLength} result
                                                </h1>
                                                <span
                                                    type="button"
                                                    className="material-symbols-outlined fs-1 position-relative"
                                                    onClick={navigateBefore}
                                                >
                                                    navigate_before
                                                </span>
                                                <span type="button" className="bg-white p-2 fs-5">{tours.page}</span>
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