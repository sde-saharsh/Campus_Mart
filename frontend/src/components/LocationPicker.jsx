import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Center of India
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

const libraries = ['places'];

const LocationPicker = ({ location, setLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY, 
    libraries
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  
  // Initial load or external update
  useEffect(() => {
    if (location && location.coordinates && location.coordinates.lat !== 0) {
        setMarkerPosition({ lat: location.coordinates.lat, lng: location.coordinates.lng });
    } else if (!markerPosition && isLoaded) { 
         if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition((position) => {
                 const pos = {
                     lat: position.coords.latitude,
                     lng: position.coords.longitude,
                 };
                 setMarkerPosition(pos);
                 
                 // Reverse Geocoding for Initial Position
                 if(setLocation) {
                    if (window.google && window.google.maps) {
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: pos }, (results, status) => {
                            if (status === "OK" && results[0]) {
                                setLocation((prev) => ({
                                    ...prev,
                                    address: results[0].formatted_address,
                                    coordinates: pos
                                }));
                            } else {
                                setLocation((prev) => ({
                                    ...prev,
                                    coordinates: pos
                                }));
                            }
                        });
                    }
                 }
             });
         }
    }
  }, [location?.coordinates?.lat, location?.coordinates?.lng, isLoaded, markerPosition]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMapClick = useCallback((e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPos = { lat, lng };
      
      setMarkerPosition(newPos);
      
      if(setLocation) {
            // Reverse Geocoding to get address
            if (window.google && window.google.maps) {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: newPos }, (results, status) => {
                    if (status === "OK" && results[0]) {
                         setLocation((prev) => ({
                            ...prev,
                            address: results[0].formatted_address,
                            coordinates: newPos
                        }));
                    } else {
                         setLocation((prev) => ({
                            ...prev,
                            coordinates: newPos
                        }));
                    }
                });
            } else {
                setLocation((prev) => ({
                    ...prev,
                    coordinates: newPos
                }));
            }
        }
  }, [setLocation]);

  if (!isLoaded) {
    return <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 rounded-xl border border-gray-300">Loading Map...</div>;
  }

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={markerPosition ? 15 : 5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
        }}
      >
        {markerPosition && (
            <Marker position={markerPosition} />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationPicker;
