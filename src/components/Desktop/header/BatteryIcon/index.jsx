import { useState, useEffect } from 'react';
import './style.css'; // Importar el archivo CSS para los estilos

const BatteryIcon = () => {
    const [batteryLevel, setBatteryLevel] = useState(100); // Nivel de la batería (inicializado a 100%)
    const [isCharging, setIsCharging] = useState(false);   // Estado de carga (si está cargando o no)

    useEffect(() => {
        // Verificamos si la Battery Status API está disponible
        if (navigator.getBattery) {
            navigator.getBattery().then((battery) => {
                // Actualizamos el nivel de batería al cargar el componente
                setBatteryLevel(battery.level * 100);
                setIsCharging(battery.charging);

                // Actualizamos el estado cuando cambie el nivel de la batería
                battery.onlevelchange = () => {
                    setBatteryLevel(battery.level * 100);
                };

                // Actualizamos el estado cuando cambie el estado de carga
                battery.onchargingchange = () => {
                    setIsCharging(battery.charging);
                };
            });
        } else {
            console.log('La Battery Status API no está soportada en este navegador.');
        }
    }, []); // Solo se ejecuta una vez al montar el componente

    return (
        <button className="header-button">
        <div className="battery-icon">
            <div
                className="battery-level"
                style={{ width: `${batteryLevel}%` }}
            />
            {/* Mostramos el icono de carga si está cargando */}
            {isCharging && <div className="charging-icon">⚡</div>}
        </div>
        </button>

    );
};

export default BatteryIcon;
