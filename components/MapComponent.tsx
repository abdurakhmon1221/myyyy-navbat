
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Organization } from '../types';
import { Building2 } from 'lucide-react';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    organizations: Organization[];
    onSelectOrg: (org: Organization) => void;
    userLocation?: { lat: number; lng: number };
}

// Component to handle map center updates
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ organizations, onSelectOrg, userLocation }) => {
    // Default to Tashkent coordinates
    const defaultCenter: [number, number] = [41.2995, 69.2401];
    const [center, setCenter] = useState<[number, number]>(defaultCenter);

    useEffect(() => {
        if (userLocation) {
            setCenter([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation]);

    return (
        <div className="h-full w-full rounded-[2.5rem] overflow-hidden shadow-inner border border-gray-200 dark:border-slate-800 z-0 relative group">
            <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', filter: 'hue-rotate(110deg) saturate(0.8) brightness(0.95)' }} className="dark:brightness-75">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater center={center} />


                {organizations.map(org => (
                    <Marker
                        key={org.id}
                        position={[org.location.lat, org.location.lng]}
                        eventHandlers={{
                            click: () => onSelectOrg(org)
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-sm text-gray-900">{org.name}</h3>
                                <p className="text-xs text-gray-500">{org.address}</p>
                                <button
                                    onClick={() => onSelectOrg(org)}
                                    className="mt-2 w-full bg-emerald-500 text-white py-1 px-3 rounded-lg text-xs font-bold"
                                >
                                    Navbat olish
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })}>
                        <Popup>Siz shu yerdasiz</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
