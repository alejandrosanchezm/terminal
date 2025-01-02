/* eslint-disable react/prop-types */
import './style.css';
import { useState, useEffect } from 'react';


export default function Dock({ apps, handleClick, handleMinimized }) {

    const [isVisible, setIsVisible] = useState(true);
    // eslint-disable-next-line no-unused-vars

    const handleMouseMove = (e) => {
        const mouseY = e.clientY;
        const screenHeight = window.innerHeight;
        const threshold = 50;
        if (mouseY >= screenHeight - threshold) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('openapp', handleOpenApp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('openapp', handleOpenApp);
        };
    }, []);

    function handleOpenApp(e) {
        alert(JSON.stringify(e))
    }

    return (
        <div className={`dock-container ${isVisible ? 'visible' : ''}`}>
            {apps.map((app, index) => (
                <div className="tooltip" key={index}>
                    <span className="tooltiptext">{app.name}</span>
                    <div
                        className={`dock-item ${app.open ? 'open' : ''}`}
                        onClick={() => {
                            if (app.open === true) {
                                handleMinimized(index)
                            } else {
                                handleClick(index)
                            }
                        }}
                    >
                        <img
                            src={app.icon.src}
                            alt={app.name}
                            width={app.icon.width || 40}
                            height={app.icon.height || 40}
                        />
                        {app.open && <div className="dot-container"><div className="dot"></div></div>}
                    </div>
                </div>
            ))}
        </div>
    );
}