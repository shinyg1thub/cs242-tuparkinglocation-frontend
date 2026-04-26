import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ParkingArea = {
    id: number;
    name: string;
    total_slots: number;
    available_slots: number;
    unavailable_slots: number;
};

type ParkingSlot = {
    name: string;
    status: "available" | "occupied" | "maintenance";
};

type ParkingDetailResponse = {
    area: ParkingArea;
    slots: ParkingSlot[];
};

export default function ParkingDetail() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ParkingDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/parking/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((json) => {
                if (json.error) {
                    throw new Error(json.error);
                }
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Parking area not found or failed to load.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center bg-[#f8fafc]">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-emerald-500 animate-spin mb-4"></div>
                <span className="text-gray-500 font-medium">Loading details...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-4 h-[70vh] flex flex-col items-center justify-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{error}</h2>
                <Link to="/" className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors shadow-md">
                    Return Home
                </Link>
            </div>
        );
    }

    const { area, slots } = data;

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20">
            {/* Header Area */}
            <div className="bg-white border-b sticky top-16 z-40 px-4 py-4 md:px-8 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-medium transition-colors bg-gray-50 hover:bg-emerald-50 px-3 py-2 rounded-xl"
                    >
                        <span className="text-lg leading-none">&laquo;</span>
                        <span>Back</span>
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{area.name}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6">
                {/* Status Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="col-span-2 md:col-span-1 glass-panel rounded-3xl p-6 flex flex-col justify-center items-center relative overflow-hidden">
                        <div className={`absolute top-0 w-full h-1 ${area.available_slots > 0 ? "bg-emerald-500" : "bg-red-500"}`}></div>
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Available</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-6xl font-black ${area.available_slots > 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {area.available_slots}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total</span>
                        <span className="text-4xl font-bold text-gray-800">{area.total_slots}</span>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Occupied</span>
                        <span className="text-4xl font-bold text-gray-800">{area.unavailable_slots}</span>
                    </div>
                </div>

                {/* Slots grid */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Slot Map</h2>
                        <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Open</span>
                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div> Full</span>
                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Service</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
                        {slots.map((slot) => {
                            const isAvail = slot.status === "available";
                            const isMaintenance = slot.status === "maintenance";
                            return (
                                <div
                                    key={slot.name}
                                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-default ${isAvail
                                            ? "bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100/50"
                                            : isMaintenance
                                                ? "bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 text-amber-700"
                                                : "bg-gradient-to-br from-gray-100 to-gray-50 border border-red-100/50 text-red-500 opacity-80"
                                        }`}
                                >
                                    <div className={`font-mono text-lg sm:text-xl font-bold ${isAvail
                                            ? "text-emerald-700"
                                            : isMaintenance
                                                ? "text-amber-700"
                                                : "text-red-400 line-through decoration-2 decoration-red-300"
                                        }`}>
                                        {slot.name.replace('Slot-', '')}
                                    </div>
                                    {isAvail ? (
                                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    ) : null}
                                    {isMaintenance ? (
                                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}