import { useEffect, useState } from "react";
import './style.css';

export default function WifiIcon() {

    const [online, setOnline] = useState(navigator.onLine);

    // Actualizar estado de la conexión en tiempo real
    useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <button className="header-button"> 
            <img
                key={online}
                src={online ? 'desktop-icons/wifi-white.png' : 'desktop-icons/no-wifi-white.png'}
                className="wifi-icon"
                alt="Wi-Fi status"
            />
        </button>
    )
}