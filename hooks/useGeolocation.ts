
import { useState, useCallback } from 'react';
import { LocationData } from '../types';

export const useGeolocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setIsLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("You denied the request for Geolocation.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable.");
                        break;
                    case err.TIMEOUT:
                        setError("The request to get user location timed out.");
                        break;
                    default:
                        setError("An unknown error occurred.");
                        break;
                }
                setIsLoading(false);
            }
        );
    }, []);

    const clearLocation = useCallback(() => {
        setLocation(null);
        setError(null);
    }, []);

    return { location, isLoading, error, getLocation, clearLocation };
};
