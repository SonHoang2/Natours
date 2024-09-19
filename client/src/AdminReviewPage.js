import LeftDashboard from "./component/LeftDashboard";

export default function AdminReviewPage() {
    return (
        <div className="h-100">
            <div className="h-100 d-flex flex-column dashboard">
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
                                    <th className="p-3">Avatar</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Active</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 align-middle">
                                        <img src="http://localhost:5000/images/users/user-66039b9961d344a771a122bb-1726457175787.jpeg" />
                                    </td>
                                    <td className="p-3 align-middle">John Doe</td>
                                    <td className="p-3 align-middle">naruto@gmail.com</td>
                                    <td className="p-3 align-middle">user</td>
                                    <td className="p-3 align-middle">true</td>
                                    <td className="p-3 align-middle">
                                        <button className="btn btn-primary me-5">Edit</button>
                                        <button className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}