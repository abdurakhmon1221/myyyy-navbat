
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Organization } from '../types';
import { Navigation } from 'lucide-react';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom User Location Icon (blue circle)
const UserLocationIcon = L.divIcon({
    html: `<div style="width: 20px; height: 20px; background: #3b82f6; border: 4px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(59,130,246,0.5);"></div>`,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

interface MapComponentProps {
    organizations: Organization[];
    onSelectOrg: (org: Organization) => void;
    userLocation?: { lat: number; lng: number };
    t: (key: string) => string;
}

const LocationControl = () => {
    const map = useMap();
    const [position, setPosition] = React.useState<[number, number] | null>(null);

    const handleLocate = () => {
        if (!navigator.geolocation) {
            alert("Geolokatsiya qo'llab-quvvatlanmaydi");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos: [number, number] = [latitude, longitude];
                setPosition(newPos);
                map.flyTo(newPos, 15);
            },
            (err) => {
                console.error(err);
                alert("Joylashuvni aniqlab bo'lmadi. Ruxsat borligini tekshiring.");
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <>
            <div style={{ position: 'absolute', top: '100px', right: '10px', zIndex: 1000 }}>
                <button
                    onClick={handleLocate}
                    className="bg-white p-3 rounded-full shadow-xl active:scale-95 transition-transform text-blue-600 border border-blue-100 flex items-center justify-center"
                    title="Mening joylashuvim"
                >
                    <Navigation size={22} className="fill-blue-100" />
                </button>
            </div>
            {position && (
                <Marker position={position} icon={UserLocationIcon}>
                    <Popup>
                        <strong style={{ color: '#3b82f6' }}>📍 Siz shu yerdasiz</strong>
                    </Popup>
                </Marker>
            )}
        </>
    );
};

const MapComponent: React.FC<MapComponentProps> = ({ organizations, onSelectOrg, userLocation, t }) => {
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
                center={[41.2995, 69.2401]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {organizations.filter(o => o.location?.lat && o.location?.lng).map(org => (
                    <Marker key={org.id} position={[org.location.lat, org.location.lng]}>
                        <Popup>
                            <strong>{org.name}</strong><br />
                            <span style={{ fontSize: '12px', color: '#666' }}>{org.address}</span><br />
                            <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                                <button
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${org.location.lat},${org.location.lng}`, '_blank')}
                                    style={{
                                        background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                                    }}
                                >
                                    Yo'l chizish
                                </button>
                                <button
                                    onClick={() => onSelectOrg(org)}
                                    style={{
                                        background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                                    }}
                                >
                                    Navbat olish
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <LocationControl />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
