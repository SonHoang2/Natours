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

    const { state } = useLocation()

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: state.name,
        email: state.email,
        role: state.role,
        active: state.active,
        avatar: {
            data: null,
        },
    });

    const uploadImg = e => {
        const img = {
            // preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setUser({ ...user, avatar: img });
    }

    const updateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (state.name !== user.name) formData.append("name", user.name);
        if (state.email !== user.email) formData.append("email", user.email);
        if (state.role !== user.role) formData.append("role", user.role);
        if (state.active !== user.active) formData.append("active", user.active);
        if (user.avatar.data) formData.append("photo", user.avatar.data);
        
        try {
            const tour = await axios.patch(`${TOURS_URL}/${state._id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            navigate("/admin/users");
        } catch (error) {
            alert(error.response.data.message);
            console.log(error);
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
                                <form onSubmit={updateUser}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        />
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