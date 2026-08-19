// src/components/MapTilerMap/MapTilerMap.jsx
import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./MapTilerMap.css";

export default function MapTilerMap({
  center = [11.52, 3.87],
  zoom = 6,
  markers = [],
  onMapLoad = null,
  showUserLocation = false,
  height = "500px",
  className = "",
  flyTo = null,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    if (!apiKey) {
      console.error("❌ MapTiler API key is missing.");
      console.log("💡 Ajoute VITE_MAPTILER_API_KEY dans .env");
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 font-semibold">
            ⚠️ Clé API MapTiler manquante
          </p>
          <p className="text-sm text-red-500">
            Ajoute VITE_MAPTILER_API_KEY dans le fichier .env
          </p>
        </div>
      );
    }

    // Configurer MapTiler
    maptilersdk.config.apiKey = apiKey;

    // Créer la carte
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: center,
      zoom: zoom,
    });

    // Ajouter les marqueurs
    if (markers.length > 0) {
      markers.forEach((marker) => {
        const popupContent = `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <strong style="color: #1E3A8A;">${marker.title}</strong>
            ${marker.description ? `<p style="margin: 4px 0; font-size: 12px; color: #6B7280;">${marker.description}</p>` : ""}
            ${marker.distance ? `<p style="margin: 4px 0; font-size: 12px; color: #F97316;">📏 ${marker.distance.toFixed(2)} km</p>` : ""}
          </div>
        `;

        new maptilersdk.Marker({
          color: marker.color || "#F97316",
          scale: marker.scale || 1,
        })
          .setLngLat([marker.lng, marker.lat])
          .setPopup(new maptilersdk.Popup().setHTML(popupContent))
          .addTo(map.current);
      });
    }

    // Position de l'utilisateur
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.longitude,
            position.coords.latitude,
          ];

          // Ajouter un marqueur pour l'utilisateur
          new maptilersdk.Marker({
            color: "#3B82F6",
            scale: 1.2,
          })
            .setLngLat(userLocation)
            .setPopup(
              new maptilersdk.Popup().setHTML(`
              <div style="padding: 8px; font-family: Arial, sans-serif;">
                <strong style="color: #3B82F6;">📍 Vous êtes ici</strong>
                <p style="margin: 4px 0; font-size: 12px; color: #6B7280;">
                  ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}
                </p>
              </div>
            `),
            )
            .addTo(map.current);

          // Centrer la carte sur l'utilisateur
          map.current.flyTo({
            center: userLocation,
            zoom: 14,
            duration: 2000,
            essential: true,
          });
        },
        (error) => {
          console.log(
            "📍 Position de l'utilisateur non disponible:",
            error.message,
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }

    // Fly to spécifique
    if (flyTo) {
      setTimeout(() => {
        map.current.flyTo({
          center: [flyTo.lng, flyTo.lat],
          zoom: flyTo.zoom || 14,
          duration: 1500,
          essential: true,
        });
      }, 500);
    }

    // Callback après chargement
    if (onMapLoad) {
      map.current.on("load", () => {
        onMapLoad(map.current);
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom, markers, onMapLoad, showUserLocation, flyTo]);

  return (
    <div
      className={`maptiler-container ${className}`}
      style={{ height: height }}
    >
      <div ref={mapContainer} className="maptiler-map" />
    </div>
  );
}
