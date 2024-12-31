import React, { useState, useRef, useEffect } from "react";
import './style.css';

// eslint-disable-next-line react/prop-types
const Window = ({ title, children, open, setOpen, isMinimized, setIsMinimized }) => {

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 50 });
  const [isMaximized, setIsMaximized] = useState(false);   // Para maximizar
  const dragStartPos = useRef({ x: 0, y: 0 });
  const ventanaRef = useRef(null);
  const headerHeight = 35; // Altura del header
  const [isActive, setIsActive] = useState(false);  
  const minimizedPosition = { x: 200, y: 500 }; 

  // Lógica para el estilo de la ventana
  const ventanaStyle = isMinimized
    ? {
        transform: `translate(${minimizedPosition.x}px, ${minimizedPosition.y}px) scale(0.2)`,
        width: '100px',
        height: '100px',
        opacity: 0, // Ventana completamente invisible cuando está minimizada
        pointerEvents: 'none', // Esto evita que interactúes con la ventana minimizada
        transition: 'transform 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out, opacity 0.3s ease-in-out',
      }
    : {
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: '500px',
        height: '300px',
        opacity: 1,
        pointerEvents: 'auto',
        transition: 'transform 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out, opacity 0.3s ease-in-out',
      };

  const handleMouseDown = (e) => {
    if (isMinimized) return; // Si la ventana está minimizada, no permitimos el arrastre
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    setIsActive(true);  // Marcar la ventana como activa cuando se haga clic
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isMinimized) { // Solo mover si no está minimizada
      const newX = e.clientX - dragStartPos.current.x;
      let newY = e.clientY - dragStartPos.current.y;

      if (newY < headerHeight) {
        newY = headerHeight;
      }

      setPosition({
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);  // Alternar entre minimizar y restaurar
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);  // Alternar entre maximizar y restaurar
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!open) return <></>;

  return (
    <div 
      className={`ventana ${isActive ? 'active' : ''}`} 
      ref={ventanaRef} 
      style={ventanaStyle}
      onClick={() => setIsActive(true)} // Al hacer clic también activar la ventana
    >
      <div 
        className="ventana-header"
        onMouseDown={handleMouseDown}
      >
        <div className="ventana-header-buttons">
          <div className="ventana-header-button close" onClick={handleClose} />
          <div className="ventana-header-button minimize" onClick={handleMinimize} />
          <div className="ventana-header-button zoom" onClick={handleMaximize} />
        </div>
        <div className="ventana-header-title">{title}</div>
      </div>
      <div className="ventana-body">
        {children}
      </div>
    </div>
  );
};

export default Window;
