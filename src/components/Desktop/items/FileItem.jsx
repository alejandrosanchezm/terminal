/* eslint-disable react/prop-types */
import { useState } from "react";
import './style.css';

export default function FileItem({file, onDrag}) {
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: file.x, y: file.y });

    const handleDragStart = () => {
        setDragging(true);
    };

    const handleDrag = (e) => {
        if (!dragging) return;
        const x = e.clientX - 40;  // Centra el icono mientras se arrastra
        const y = e.clientY - 50;
        setPosition({ x, y });  // Actualiza la posición en tiempo real
    };

    const handleDragEnd = (e) => {
        setDragging(false);
        const gridSize = 80;
        const x = Math.round(e.clientX / gridSize) * gridSize;
        const y = Math.round(e.clientY / gridSize) * gridSize;
        onDrag(file.id, x, y);  // Ajuste final a la cuadrícula
    };

    return (
        <div
            className={`file-icon ${dragging ? 'dragging' : ''}`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: dragging ? 'none' : 'transform 0.2s ease-out'
            }}
            draggable
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
        >
            <div className="file-icon-image">
                📄
            </div>
            <div className="file-icon-name">
                {file.name}
            </div>
        </div>
    );
};