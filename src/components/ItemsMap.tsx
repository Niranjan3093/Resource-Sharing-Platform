
import { useEffect, useRef, useState } from "react";
import { Item } from "@/types";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ItemsMapProps {
  items: Item[];
  selectedItemId?: string | null;
  className?: string;
}

const ItemsMap = ({ items, selectedItemId, className = "" }: ItemsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const navigate = useNavigate();
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      // Default center if no items (Kathmandu)
      const center: [number, number] = [27.7172, 85.3240];
      
      map.current = L.map(mapContainer.current, {
        center: center,
        zoom: 12,
        attributionControl: true,
        zoomControl: true
      });
      
      // Fix icon paths for Leaflet
      // TypeScript-safe approach without using _getIconUrl
      const DefaultIcon = L.icon({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      L.Marker.prototype.options.icon = DefaultIcon;
      
      // Use OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map.current);

      // Add zoom controls
      L.control.zoom({
        position: 'topright'
      }).addTo(map.current);

      setMapInitialized(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when items change or map is initialized
  useEffect(() => {
    if (!map.current || !mapInitialized || !items.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Calculate bounds
    const bounds = L.latLngBounds([]);
    let hasValidCoordinates = false;

    // Add markers for each item
    items.forEach(item => {
      // Skip if item doesn't have coordinates
      if (!item.coordinates || item.coordinates.length !== 2) return;
      
      // Leaflet uses [lat, lng] but our data is [lng, lat]
      const [lng, lat] = item.coordinates;
      
      // Create marker with custom popup
      const marker = L.marker([lat, lng]).addTo(map.current!);
      
      // Add popup with item info
      const popupContent = `
        <div class="p-2">
          <div class="font-medium">${item.title}</div>
          <div class="text-sm text-gray-500">${item.location}</div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Add click event to navigate to item details
      marker.on('click', () => {
        navigate(`/items/${item.id}`);
      });
      
      // Store marker reference
      markersRef.current[item.id] = marker;
      
      // Extend bounds
      bounds.extend([lat, lng]);
      hasValidCoordinates = true;
    });

    // Fit bounds if we have valid coordinates
    if (hasValidCoordinates) {
      if (items.length > 1) {
        map.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
        });
      } else if (items.length === 1 && items[0].coordinates) {
        // Center on single item
        const [lng, lat] = items[0].coordinates;
        map.current.setView([lat, lng], 14, {
          animate: true
        });
      }
    }
  }, [items, mapInitialized, navigate]);

  // Center on selected item
  useEffect(() => {
    if (!map.current || !mapInitialized || !selectedItemId) return;

    const selectedItem = items.find(item => item.id === selectedItemId);
    if (selectedItem?.coordinates && selectedItem.coordinates.length === 2) {
      const [lng, lat] = selectedItem.coordinates;
      map.current.setView([lat, lng], 15, {
        animate: true
      });

      // Highlight the selected marker by opening its popup
      const marker = markersRef.current[selectedItemId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedItemId, items, mapInitialized]);

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
          <div className="animate-spin-slow h-10 w-10 rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ItemsMap;
