import { useState, useEffect } from "react";

interface Geolocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    // Verifica se o navegador suporta Geolocation
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation não é suportado por este navegador.",
        isLoading: false,
      });
      return;
    }

    // Função de sucesso quando a geolocalização é obtida
    const successCallback = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isLoading: false,
      });
    };

    // Função de erro caso algo dê errado
    const errorCallback = (error: GeolocationPositionError) => {
      setLocation({
        latitude: null,
        longitude: null,
        error: error.message,
        isLoading: false,
      });
    };

    // Solicita a geolocalização
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []); // O hook é executado uma vez, quando o componente é montado.

  return location;
};
