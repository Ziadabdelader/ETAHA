'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MapPin, ExternalLink, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LocationPickerProps {
  value?: string;
  onChange: (locationLink: string) => void;
  label?: string;
  placeholder?: string;
}

export function LocationPicker({ value, onChange, label, placeholder }: LocationPickerProps) {
  const { t } = useTranslation();
  const [locationLink, setLocationLink] = useState(value || '');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    setLocationLink(value || '');
  }, [value]);

  useEffect(() => {
    // Load Leaflet CSS and JS when dialog opens
    if (isMapOpen && !mapLoaded) {
      loadLeafletLibrary();
    }
  }, [isMapOpen]);

  useEffect(() => {
    // Initialize map when loaded
    if (mapLoaded && isMapOpen && !map) {
      setTimeout(() => initializeMap(), 100);
    }
  }, [mapLoaded, isMapOpen]);

  const loadLeafletLibrary = () => {
    // Check if Leaflet is already loaded
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Leaflet library');
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    const L = (window as any).L;
    if (!L) return;

    const mapElement = document.getElementById('location-map');
    if (!mapElement) return;

    // Default to Cairo, Egypt (you can change this)
    const defaultLocation: [number, number] = [30.0444, 31.2357];

    // Create map
    const newMap = L.map('location-map').setView(defaultLocation, 13);

    // Add OpenStreetMap tiles (free!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(newMap);

    // Create custom icon for marker
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add marker
    const newMarker = L.marker(defaultLocation, {
      draggable: true,
      icon: customIcon
    }).addTo(newMap);

    // Set initial selected location
    setSelectedLocation({ lat: defaultLocation[0], lng: defaultLocation[1] });

    // Update location when marker is dragged
    newMarker.on('dragend', () => {
      const position = newMarker.getLatLng();
      setSelectedLocation({ lat: position.lat, lng: position.lng });
    });

    // Update location when map is clicked
    newMap.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      newMarker.setLatLng([lat, lng]);
      setSelectedLocation({ lat, lng });
    });

    setMap(newMap);
    setMarker(newMarker);

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          newMap.setView(userLocation, 13);
          newMarker.setLatLng(userLocation);
          setSelectedLocation({ lat: userLocation[0], lng: userLocation[1] });
        },
        () => {
          // If user denies location, keep default
        }
      );
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      // Generate Google Maps link (works without API key for viewing)
      const link = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;
      setLocationLink(link);
      onChange(link);
      handleCloseMap();
    }
  };

  const handleCloseMap = () => {
    // Clean up map
    if (map) {
      map.remove();
      setMap(null);
      setMarker(null);
    }
    setIsMapOpen(false);
  };

  const handleClear = () => {
    setLocationLink('');
    onChange('');
    setSelectedLocation(null);
  };

  const handleManualChange = (newValue: string) => {
    setLocationLink(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location-link" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label || t('address.locationLink')}
        <span className="text-xs text-muted-foreground font-normal">({t('common.optional')})</span>
      </Label>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="location-link"
            type="url"
            value={locationLink}
            onChange={(e) => handleManualChange(e.target.value)}
            placeholder={placeholder || t('address.locationLinkPlaceholder')}
            className="pr-8"
          />
          {locationLink && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapOpen(true)}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          {t('address.pickLocation')}
        </Button>
      </div>
      
      {locationLink && (
        <a
          href={locationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          {t('address.viewOnMap')}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}

      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={(open) => !open && handleCloseMap()}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t('address.selectLocation')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('address.mapInstructions')}
            </p>
            
            {/* Map Container */}
            <div 
              id="location-map" 
              className="w-full h-[400px] rounded-lg border"
              style={{ minHeight: '400px' }}
            />
            
            {selectedLocation && (
              <div className="text-sm text-muted-foreground">
                <strong>{t('address.selectedCoordinates')}:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseMap}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedLocation}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
