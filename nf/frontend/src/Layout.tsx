import { Outlet } from "react-router-dom";
import { DockNav } from "./components/nav-dock";

export function Layout() {
    return (
        <div>
            <div className="min-h-screen">
                <Outlet />
            </div>
            <DockNav />
        </div>
    )
}