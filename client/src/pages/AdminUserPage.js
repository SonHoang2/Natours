import axios from "axios";
import LeftDashboard from "../component/LeftDashboard";
import { useEffect, useState } from "react";
import { USERS_URL, USER_IMAGE_URL } from "../customValue";
import { Link } from "react-router-dom";

export default function AdminUserPage() {
    const [users, setUsers] = useState({
        data: [],
        totalLength: 0,
        currentLength: 0,
    });

    const [userQueryParams, setUserQueryParams] = useState({
        limit: 5,
        page: 1,
        sort: "-createdAt,name",
    });

    const getUser = async () => {
        try {
            const users = await axios.get(USERS_URL + `/?limit=${userQueryParams.limit}&sort=${userQueryParams.sort}&page=${userQueryParams.page}`,
                {
                    withCredentials: true
                });

            console.log(users.data);

            let currentLength = userQueryParams.limit * userQueryParams.page;

            if (currentLength > users.data.total) {
                currentLength = users.data.total;
            }

            setUsers({
                data: users.data.data.doc,
                totalLength: users.data.total,
                currentLength: currentLength
            });

        } catch (error) {
            alert("Error getting users");
            console.error(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            const user = await axios.patch(USERS_URL + `/${id}`, {
                active: false
            }, {
                withCredentials: true
            });

            console.log(user.data);
            
            getUser();
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
            if (prev.page < Math.ceil(users.totalLength / prev.limit)) {
                obj = { ...prev, page: prev.page + 1 };
            }
            return obj;
        })

    useEffect(() => {
        getUser();
    }, [userQueryParams.page]);

    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex h-100">
                    <LeftDashboard />
                    <div className="px-4 py-5 bg-light w-100">
                        <div className="pb-5">
                            <h5 className="text-uppercase fs-6 text-muted pb-2 page-subtitle">Overview</h5>
                            <h3 className="fs-3 text-success">Users</h3>
                        </div>
                        <table className="bg-white w-100 shadow border ">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="p-3 text-capitalize">Avatar</th>
                                    <th className="p-3 text-capitalize">Name</th>
                                    <th className="p-3 text-capitalize">Email</th>
                                    <th className="p-3 text-capitalize">Role</th>
                                    <th className="p-3 text-capitalize">Active</th>
                                    <th className="p-3 text-capitalize">Edit</th>
                                    <th className="p-3 text-capitalize">Delete</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    users.data.map((user) => (
                                        <tr key={user._id}>
                                            <td className="p-3 align-middle">
                                                <img
                                                    className="rounded-circle user-avatar"
                                                    src={USER_IMAGE_URL + user.photo}
                                                    alt="user" />
                                            </td>
                                            <td className="p-3 align-middle">{user.name}</td>
                                            <td className="p-3 align-middle">{user.email}</td>
                                            <td className="p-3 align-middle">{user.role}</td>
                                            <td className="p-3 align-middle">{user.active ? "true" : "false"}</td>
                                            <td className="p-3 align-middle">
                                                <Link
                                                    to={`./edit`}
                                                    state={user}
                                                    className="material-symbols-outlined text-primary p-2 bg-white rounded border-0 text-decoration-none"
                                                >
                                                    edit
                                                </Link>
                                            </td>
                                            <td className="p-3 align-middle">
                                                <button
                                                    className="material-symbols-outlined text-danger p-2 bg-white rounded border-0"
                                                    onClick={() => deleteUser(user._id)}
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
                                                    {users.currentLength} of {users.totalLength} result
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