import Header from "./component/Header"

export default function Dashboard() {
    return (
        <div className="h-100">
            <Header />
            <div className="pb-5"></div>
            <div className="pb-3"></div>
            <div className="d-flex w-100 h-100">
                <div className="bg-success pt-4 h-100">
                    <div className="d-flex align-items-center px-5 py-3">
                        <span className="material-symbols-outlined pe-3 text-white">dashboard</span>
                        <h3 className="text-white fs-5">Dashboard</h3>
                    </div>
                </div>
                <div className="p-5 w-100">
                    <h5 className="text-uppercase fs-6 text-muted pb-2">Dashboard</h5>
                    <h3 className="fs-3 text-success-light">Blog Overview</h3>
                </div>
            </div>
        </div>
    )
}