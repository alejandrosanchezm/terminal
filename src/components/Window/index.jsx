import React, { useState, useRef } from "react";
import './style.css';

// eslint-disable-next-line react/prop-types
const Window = ({ title, style={}, children, open, setOpen, isMinimized, setIsMinimized }) => {

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 50 });
  const [isMaximized, setIsMaximized] = useState(false);   // Para maximizar
  const dragStartPos = useRef({ x: 0, y: 0 });
  const ventanaRef = useRef(null);
  const headerHeight = -15; // Altura del header
  const [isActive, setIsActive] = useState(false);  

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    setIsActive(true);  // Marcar la ventana como activa cuando se haga clic
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // Calculamos las nuevas coordenadas
      const newX = e.clientX - dragStartPos.current.x;
      let newY = e.clientY - dragStartPos.current.y;

      // Limitamos la posición y para que no atraviese el header (se quede abajo del header)
      if (newY < headerHeight) {
        newY = headerHeight; // Evita que pase por encima del header
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
    // Para cerrar la ventana, podemos simplemente ocultarla
    setOpen(false);
  };

  React.useEffect(() => {
    // Añadir y eliminar eventos de mouse
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Establecer las dimensiones de la ventana en función de si está maximizada
  const ventanaStyle = isMaximized
  ? { transform: `translate(${position.x}px, ${position.y}px)`, width: '100vw', height: '100vh', ...style }
  : { transform: `translate(${position.x}px, ${position.y}px)`, ...style }

  if (!open || isMinimized) return <></>;

  return (
    <div 
      className={`ventana ${isActive ? 'active' : ''}`} 
      ref={ventanaRef} 
      style={ventanaStyle}
      onClick={() => setIsActive(true)} // Al hacer clic también activar la ventana
    >
      <div 
        className="ventana-header"
        onMouseDown={handleMouseDown} // Hacer que la cabecera sea arrastrable
      >
        <div className="ventana-header-buttons">
          <div 
            className="ventana-header-button close" 
            onClick={handleClose}
          />
          <div 
            className="ventana-header-button minimize" 
            onClick={handleMinimize}
          />
          <div 
            className="ventana-header-button zoom" 
            onClick={handleMaximize}
          />
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
