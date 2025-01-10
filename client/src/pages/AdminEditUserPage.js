import axios from "axios";
import LeftDashboard from "../component/LeftDashboard";
import { useEffect, useState } from "react";
import { USERS_URL, USER_IMAGE_URL } from "../customValue";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminEditUserPage() {
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
            const user = await axios.patch(`${USERS_URL}/${state._id}`, formData, {
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
                            <h1 className="p-3 bg-light">Edit User</h1>
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
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={user.email}
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            value={user.role}
                                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Active</label>
                                        <select
                                            className="form-select" value={user.active}
                                            onChange={(e) => setUser({ ...user, active: e.target.value })}
                                        >
                                            <option value="true">true</option>
                                            <option value="false">false</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Avatar</label>
                                        <input
                                            type="file"
                                            id="avatar"
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