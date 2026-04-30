import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <nav className="glass-panel sticky top-0 z-50 transition-all duration-300">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <img src="/images/logoTUparkingLocation.png" alt="TU Parking Location Logo" className="h-8 sm:h-10 w-auto object-contain drop-shadow-md transition-transform hover:scale-105" />
                        <h1 className="hidden sm:block bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-lg sm:text-xl font-bold tracking-tight text-transparent">
                            TUparkingLocation
                        </h1>
                        <h1 className="sm:hidden bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-base font-bold text-transparent">
                            TU Parking
                        </h1>
                    </Link>

                    <div className="ml-auto flex items-center gap-1 sm:gap-2">
                        <Link
                            to="/"
                            className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${location.pathname === "/"
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/test"
                            className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${location.pathname === "/test"
                                ? "bg-sky-600 text-white shadow-md"
                                : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex w-full flex-grow flex-col">{children}</main>

            <footer className="mt-auto py-8 text-center text-xs font-semibold text-slate-400 tracking-wider">
                © 2026 G07 TUรู้พิกัด
            </footer>
        </div>
    );
}