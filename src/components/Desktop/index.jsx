import Dock from "../Dock";
import BatteryIcon from "./header/BatteryIcon";
import WifiIcon from "./header/WifiIcon";
import './style.css';
import { formatNow } from '../../utils/date';
import { useEffect, useState } from "react";
import Calendar from '../Calendar';
import Notes from '../Notes';
import Terminal from '../Terminal';
import Navigator from "../Navigator";
import Login from "../Login";

const LOGGED = "LOGIN_DATA";

export default function Desktop() {
    const [currentTime, setCurrentTime] = useState(formatNow());
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        try {
            let response = localStorage.getItem(LOGGED)
            if (response !== undefined && response != null) {
                return true;
            }
        } catch {
            return false;
        }
    });

    function handleLogin(isLoggedIn) {
        localStorage.setItem(LOGGED, isLoggedIn)
        setIsLoggedIn(isLoggedIn)
    }

    const [apps, setApps] = useState([
        {
            name: 'Calendario',
            icon: { src: './icons/calendar.png' },
            open: false,
            component: Calendar
        },
        {
            name: 'Notas',
            icon: { src: './icons/notes.png' },
            open: false,
            component: Notes
        },
        {
            name: 'Terminal',
            icon: { src: './icons/terminal.avif', width: '45px', height: '45px' },
            open: false,
            component: Terminal
        },
        {
            name: 'Chrome',
            icon: { src: './icons/chrome.png' },
            open: false,
            component: Navigator
        }
    ]);

    // Actualizar la hora cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(formatNow());
        }, 60000); // 60 segundos

        return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    // let folders = desktopNode.children.filter((x) => x.type === 'folder')

    // Función para manejar el clic en una aplicación
    const handleClick = (index) => {
        setApps((prevApps) => {
            return prevApps.map((app, i) =>
                i === index ? { ...app, open: !app.open } : app
            );
        });
    };

    const handleMinimized = (index) => {
        setApps((prevApps) => {
            return prevApps.map((app, i) =>
                i === index ? { ...app, minimized: !app.minimized } : app
            );
        });
    }

    return (
        <div className="desktop">
            <button onClick={() => {setIsLoggedIn(false)}}>
                <img src="desktop-icons/apple.png" className="apple-icon" />
            </button>
            <div className="header">
                <BatteryIcon />
                <WifiIcon />
                {isLoggedIn && <button className="header-button">
                    <span className="header-date">{currentTime}</span>
                </button>}
            </div>
            <img src="Monterey.jpg" id="background" alt="Desktop background" style={isLoggedIn ? {} : {filter: 'blur(0.8px)'}}/>
            <div className="desktop-login">
                {
                    !isLoggedIn &&
                    <Login setIsLoggedIn={handleLogin} />
                }
            </div>
            <div className="desktop-content">
                {
                    isLoggedIn &&
                    <div className="desktop-items">
                        <Dock apps={apps} setApps={setApps} handleClick={handleClick} handleMinimized={handleMinimized} />
                        {apps.map((app, index) => (
                            <>
                                {app.open && (
                                    <app.component
                                        open={app.open}
                                        setOpen={() => handleClick(index)} // Cambia el estado de 'open'
                                        isMinimized={app.minimized}
                                        setIsMinimized={() => handleMinimized(index)}
                                    />
                                )}
                            </>
                        ))}
                    </div>
                }

            </div>

        </div>
    );
}
