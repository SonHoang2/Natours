import axios from "axios";
import LeftDashboard from "./component/LeftDashboard";
import { useEffect, useState } from "react";
import { TOURS_URL } from "./customValue";
import { useNavigate, useLocation } from "react-router-dom";


export default function AdminEditTourPage() {
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

    const [tour, setTour] = useState({
        imageCover: {
            data: null,
        },
        name: state.name,
        duration: state.duration,
        maxGroupSize: state.maxGroupSize,
        price: state.price,
        summary: state.summary,
        description: state.description,
        difficulty: state.difficulty,
        secretTour: state.secretTour,
        active: state.active,
    });

    const uploadImg = e => {
        const img = {
            // preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setTour({ ...tour, avatar: img });
    }

    const updateTour = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (tour.imageCover.data !== null) formData.append("imageCover", tour.imageCover.data);
        if (tour.name !== state.name) formData.append("name", tour.name);
        if (tour.duration !== state.duration) formData.append("duration", tour.duration);
        if (tour.maxGroupSize !== state.maxGroupSize) formData.append("maxGroupSize", tour.maxGroupSize);
        if (tour.price !== state.price) formData.append("price", tour.price);
        if (tour.summary !== state.summary) formData.append("summary", tour.summary);
        if (tour.description !== state.description) formData.append("secretTour", tour.secretTour);
        if (tour.difficulty !== state.difficulty) formData.append("difficulty", tour.difficulty);
        if (tour.secretTour !== state.secretTour) formData.append("secretTour", tour.secretTour);
        if (tour.active !== state.active) formData.append("active", tour.active);

        try {
            const tour = await axios.patch(`${TOURS_URL}/${state._id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            navigate("/admin/tours");
        } catch (error) {
            alert(error.response.data.message);
            console.log(error);
        }
    }

    console.log(tour);
    

    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex h-100">
                    <LeftDashboard />
                    <div className="px-4 py-5 bg-light w-100">
                        <div className="bg-white w-100 shadow border mt-5">
                            <h1 className="p-3 bg-light">Edit Tour</h1>
                            <div className="p-3">
                                <form onSubmit={updateTour}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="name">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className="form-control"
                                            value={tour.name}
                                            onChange={(e) => setTour({ ...tour, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="duration">duration</label>
                                        <input
                                            id="duration"
                                            type="text"
                                            className="form-control"
                                            value={tour.duration}
                                            onChange={(e) => setTour({ ...tour, duration: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="maxGroupSize">maxGroupSize</label>
                                        <input
                                            id="maxGroupSize"
                                            type="text"
                                            className="form-control"
                                            value={tour.maxGroupSize}
                                            onChange={(e) => setTour({ ...tour, maxGroupSize: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">price</label>
                                        <input
                                            id="price"
                                            type="text"
                                            className="form-control"
                                            value={tour.price}
                                            onChange={(e) => setTour({ ...tour, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="summary">summary</label>
                                        <input
                                            id="summary"
                                            type="text"
                                            className="form-control"
                                            value={tour.summary}
                                            onChange={(e) => setTour({ ...tour, summary: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="description">description</label>
                                        <textarea
                                            id="description"
                                            type="text"
                                            className="form-control"
                                            rows="5"
                                            value={tour.description}
                                            onChange={(e) => setTour({ ...tour, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="difficulty">difficulty</label>
                                        <select
                                            id="difficulty"
                                            className="form-select"
                                            value={tour.difficulty}
                                            onChange={(e) => setTour({ ...tour, difficulty: e.target.value })}
                                        >
                                            <option value="easy">easy</option>
                                            <option value="medium">medium</option>
                                            <option value="difficult">difficult</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="active">active</label>
                                        <select
                                            id="active"
                                            className="form-select"
                                            value={tour.active}
                                            onChange={(e) => setTour({ ...tour, active: e.target.value })}
                                        >
                                            <option value="true">true</option>
                                            <option value="false">false</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="secret-tour">secretTour</label>
                                        <select
                                            id="secret-tour"
                                            className="form-select"
                                            value={tour.secretTour}
                                            onChange={(e) => setTour({ ...tour, secretTour: e.target.value })}
                                        >
                                            <option value="true">true</option>
                                            <option value="false">false</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="tour-img">Tour Image Cover</label>
                                        <input
                                            type="file"
                                            id="tour-img"
                                            name="filename"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={uploadImg}
                                        />
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