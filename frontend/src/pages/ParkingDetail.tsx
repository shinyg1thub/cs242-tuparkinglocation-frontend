import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// ============================================================
// Types
// ============================================================
type ParkingArea = {
    id: number;
    name: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    total_slots: number;
    available_slots: number;
    unavailable_slots: number;
    allowed_types?: string[];
};

type ParkingSlot = {
    name: string;
    status: "available" | "occupied" | "maintenance";
};

type ParkingDetailResponse = {
    area: ParkingArea;
    slots: ParkingSlot[];
};

// ============================================================
// Helper: Build Google Maps navigation URL
// ============================================================
function buildGoogleMapsUrl(area: ParkingArea): string {
    if (area.latitude && area.longitude) {
        // Deep-link directly to the coordinates (opens navigation)
        return `https://www.google.com/maps/dir/?api=1&destination=${area.latitude},${area.longitude}&travelmode=driving`;
    }
    if (area.address) {
        // Fallback: search by address
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area.address)}`;
    }
    // Last resort: search by name
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area.name + " Thammasat University Rangsit")}`;
}

// ============================================================
// Badge labels for allowed types
// ============================================================
const TYPE_META: Record<string, { label: string; emoji: string; bg: string; text: string }> = {
    staff:    { label: "บุคลากร",   emoji: "🏛️", bg: "bg-blue-100",   text: "text-blue-700" },
    general:  { label: "คนทั่วไป", emoji: "👤", bg: "bg-emerald-100", text: "text-emerald-700" },
    disabled: { label: "ผู้พิการ",  emoji: "♿", bg: "bg-purple-100",  text: "text-purple-700" },
};

// ============================================================
// Component
// ============================================================
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
                if (json.error) throw new Error(json.error);
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
            <div className="h-[70vh] flex flex-col items-center justify-center bg-transparent">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-emerald-500 animate-spin mb-4" />
                <span className="text-gray-500 font-medium">Loading details...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-4 h-[70vh] flex flex-col items-center justify-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{error}</h2>
                <Link
                    to="/"
                    className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors shadow-md"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    const { area, slots } = data;
    const mapsUrl = buildGoogleMapsUrl(area);
    const hasCoords = !!(area.latitude && area.longitude);

    return (
        <div className="bg-transparent min-h-screen pb-20">
            {/* ── Sticky Header ── */}
            <div className="bg-white border-b sticky top-16 z-40 px-4 py-4 md:px-8 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-medium transition-colors bg-gray-50 hover:bg-emerald-50 px-3 py-2 rounded-xl shrink-0"
                    >
                        <span className="text-lg leading-none">&laquo;</span>
                        <span>Back</span>
                    </Link>

                    <div className="flex items-center gap-3 min-w-0">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">{area.name}</h1>

                        {/* ── Google Maps Navigation Button ── */}
                        <a
                            id="navigate-btn"
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={hasCoords ? "นำทางไปยังที่จอดรถนี้" : "ค้นหาที่จอดรถนี้ใน Google Maps"}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                                       bg-blue-600 text-white shadow-md shadow-blue-200
                                       hover:bg-blue-700 active:scale-95 transition-all duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
                            </svg>
                            <span className="hidden sm:inline">นำทาง</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6 space-y-5">

                {/* ── Info Card (address + allowed types + navigate) ── */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Address */}
                        {area.address && (
                            <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
                                </svg>
                                <span className="leading-snug">{area.address}</span>
                            </div>
                        )}

                        {/* Coordinates */}
                        {hasCoords && (
                            <p className="text-xs text-gray-400 font-mono mb-3">
                                {area.latitude?.toFixed(6)}, {area.longitude?.toFixed(6)}
                            </p>
                        )}

                        {/* Allowed types */}
                        {area.allowed_types && area.allowed_types.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                <span className="text-xs text-gray-400 self-center">อนุญาต:</span>
                                {area.allowed_types.map((t) => {
                                    const meta = TYPE_META[t];
                                    if (!meta) return null;
                                    return (
                                        <span
                                            key={t}
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}
                                        >
                                            {meta.emoji} {meta.label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Big navigate CTA */}
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="navigate-cta-btn"
                        className="flex flex-col items-center justify-center gap-1.5 px-6 py-4 rounded-2xl
                                   bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold shadow-lg shadow-blue-200
                                   hover:from-blue-600 hover:to-blue-800 active:scale-95 transition-all duration-150 shrink-0 min-w-[110px]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM13 18.59V17a1 1 0 0 0-1-1H9v-2h3a1 1 0 0 0 1-1V9.41l4.29 4.29-4.29 4.29z"/>
                        </svg>
                        <span className="text-sm leading-none">นำทาง</span>
                        <span className="text-[10px] font-normal opacity-80 leading-none">Google Maps</span>
                    </a>
                </div>

                {/* ── Status Dashboard ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-2 md:col-span-1 glass-panel rounded-3xl p-6 flex flex-col justify-center items-center relative overflow-hidden">
                        <div className={`absolute top-0 w-full h-1 ${area.available_slots > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
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

                {/* ── Slots Grid ── */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Slot Map</h2>
                        <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-emerald-400" /> Open
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" /> Full
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-amber-400" /> Service
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
                        {slots.map((slot) => {
                            const isAvail = slot.status === "available";
                            const isMaintenance = slot.status === "maintenance";
                            return (
                                <div
                                    key={slot.name}
                                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-default ${
                                        isAvail
                                            ? "bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100/50"
                                            : isMaintenance
                                            ? "bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 text-amber-700"
                                            : "bg-gradient-to-br from-gray-100 to-gray-50 border border-red-100/50 text-red-500 opacity-80"
                                    }`}
                                >
                                    <div
                                        className={`font-mono text-lg sm:text-xl font-bold ${
                                            isAvail
                                                ? "text-emerald-700"
                                                : isMaintenance
                                                ? "text-amber-700"
                                                : "text-red-400 line-through decoration-2 decoration-red-300"
                                        }`}
                                    >
                                        {slot.name.replace("Slot-", "")}
                                    </div>
                                    {isAvail && (
                                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    )}
                                    {isMaintenance && (
                                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}