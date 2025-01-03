// src/Calendar.js

import { useState } from "react";
import './style.css';

const InnerCalendar = () => {
  const [fecha, setFecha] = useState(new Date());

  // Generar días del mes
  const generarDias = (fecha) => {
    const dias = [];
    const inicioDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const finDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    let diaSemanaInicio = inicioDelMes.getDay();

    // Ajustar el día de inicio para que la semana comience en lunes (0: domingo, 1: lunes, ..., 6: sábado)
    if (diaSemanaInicio === 0) {
      diaSemanaInicio = 6; // Si es domingo, lo ajustamos a sábado
    } else {
      diaSemanaInicio -= 1; // Desplazamos el resto para que lunes sea 0, martes 1, etc.
    }

    const diasEnMes = finDelMes.getDate();

    // Llenar los días antes del primer día del mes (ajustado al lunes)
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    // Llenar los días del mes
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i);
    }

    return dias;
  };

  // Cambiar de mes
  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setMonth(fecha.getMonth() + direccion);
    setFecha(nuevaFecha);
  };

  const dias = generarDias(fecha);
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const nombreMes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();

  return (
    <div className="calendario">
      <div className="calendario-header">
        <div className="calendario-titulo">
          {nombreMes} {anio}
        </div>
        <div className="calendario-btn-group">
          <button className="calendario-btn" onClick={() => cambiarMes(-1)}>&lt;</button>
          <button className="calendario-btn" onClick={() => setFecha(new Date())}>Hoy</button>
          <button className="calendario-btn" onClick={() => cambiarMes(1)}>&gt;</button>
        </div>
      </div>
      <div className="calendario-dias">
        <div className="calendario-nombres-dias">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
          <div>Dom</div>
        </div>
        <div className="calendario-matriz">
          <div className="calendario-matriz-dias">
            {dias.map((dia, index) => (
              <div key={index} className={`calendario-dia ${dia ? "" : "vacío"}`}>
                {dia}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerCalendar;
