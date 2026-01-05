import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
// Fix missing marker icons in Leaflet
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setPosition, position }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LocationPicker = ({ location, setLocation }) => {
    // Default to Center of India if no location
    const defaultCenter = [20.5937, 78.9629]; 
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if(location && location.coordinates && location.coordinates.lat !== 0) {
            setPosition({ lat: location.coordinates.lat, lng: location.coordinates.lng });
        } else {
             // Try to locate user
             if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition({ lat: latitude, lng: longitude });
                    if(setLocation) {
                        setLocation({
                            ...location,
                            coordinates: { lat: latitude, lng: longitude }
                        });
                    }
                });
             }
        }
    }, []);

    const handleSetPosition = (pos) => {
        setPosition(pos);
        if(setLocation){
            setLocation({
                ...location,
                coordinates: { lat: pos.lat, lng: pos.lng }
            });
        }
    }

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
            <MapContainer 
                center={position || defaultCenter} 
                zoom={5} 
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;
