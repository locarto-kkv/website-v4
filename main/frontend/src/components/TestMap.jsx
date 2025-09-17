// src/components/TestMap.jsx
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TestMap = () => {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer center={[19.7515, 75.7139]} zoom={7} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default TestMap;