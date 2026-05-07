// Google Maps TypeScript declarations
interface Window {
  google: typeof google;
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      addListener(eventName: string, handler: Function): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latlng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      addListener(eventName: string, handler: Function): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      map?: Map;
      position?: LatLng | LatLngLiteral;
      draggable?: boolean;
      animation?: Animation;
    }

    enum Animation {
      DROP = 1,
      BOUNCE = 2,
    }
  }
}
