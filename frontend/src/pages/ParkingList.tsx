import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type ParkingArea = {
    id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
    total_slots: number;
    available_slots: number;
    unavailable_slots: number;
};

// Create a custom DivIcon for markers
const createCustomIcon = (available: number) => {
    const isFull = available === 0;
    const colorClass = isFull ? "bg-red-500" : "bg-emerald-500";
    return L.divIcon({
        className: "custom-leaflet-icon",
        html: `<div class="relative w-10 h-10 transform transition-transform hover:scale-110">
             <div class="absolute inset-0 rounded-full ${colorClass} opacity-20 animate-ping"></div>
             <div class="absolute inset-1 rounded-full ${colorClass} border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
               ${available}
             </div>
           </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

export default function ParkingList() {
    const [areas, setAreas] = useState<ParkingArea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/parking")
            .then((res) => res.json())
            .then((data) => {
                setAreas(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch parking areas", err);
                setLoading(false);
            });
    }, []);

    // Center on TU Rangsit
    const centerLat = 14.0722;
    const centerLng = 100.6050;

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Map Section (Fixed Height on Mobile, larger on Desktop) */}
            <div className="w-full h-[40vh] md:h-[50vh] relative z-0 shrink-0">
                <MapContainer
                    center={[centerLat, centerLng]}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {areas.map((area) =>
                        area.latitude && area.longitude ? (
                            <Marker
                                key={`marker-${area.id}`}
                                position={[area.latitude, area.longitude]}
                                icon={createCustomIcon(area.available_slots)}
                            >
                                <Popup className="rounded-xl overflow-hidden shadow-sm">
                                    <div className="font-semibold text-gray-900">{area.name}</div>
                                    <div className="text-sm text-gray-600">{area.available_slots} / {area.total_slots} available</div>
                                    <Link to={`/parking/${area.id}`} className="mt-2 block w-full text-center bg-emerald-100 text-emerald-800 rounded-md py-1 text-xs font-medium">View Info</Link>
                                </Popup>
                            </Marker>
                        ) : null
                    )}
                </MapContainer>

                {/* Decorative shadow and overlay for smooth transition */}
                <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#f8fafc] to-transparent z-[400] pointer-events-none"></div>
            </div>

            {/* List Section */}
            <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto w-full pb-20">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Campus Parking
                        </h2>
                        <p className="text-sm text-emerald-600 font-medium mt-1">
                            Real-time availability
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-emerald-500 animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {areas.map((area) => (
                            <Link
                                key={area.id}
                                to={`/parking/${area.id}`}
                                className="bg-white rounded-[24px] border border-gray-100/80 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 transform hover:-translate-y-1 block relative overflow-hidden group"
                            >
                                {/* Accent line on left */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${area.available_slots > 0 ? "bg-emerald-500" : "bg-red-400"}`}></div>

                                <div className="p-5 pl-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <span className="bg-gray-100 p-1.5 rounded-lg">🅿️</span>
                                            {area.name}
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${area.available_slots > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                            {area.available_slots > 0 ? 'OPEN' : 'FULL'}
                                        </span>
                                    </div>

                                    <div className="flex items-end gap-1 mb-2">
                                        <span className={`text-4xl font-extrabold ${area.available_slots > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {area.available_slots}
                                        </span>
                                        <span className="text-base text-gray-400 mb-1 font-medium">/ {area.total_slots} slots</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ease-out ${area.available_slots > 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-red-400'}`}
                                            style={{ width: `${(area.available_slots / area.total_slots) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}