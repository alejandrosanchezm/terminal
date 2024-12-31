export function formatNow() {
    const fecha = new Date();
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    
    const diaSemana = dias[fecha.getDay()]; 
    const diaDelMes = fecha.getDate(); 
    const mes = meses[fecha.getMonth()]; 
    const horas = fecha.getHours().toString().padStart(2, '0'); 
    const minutos = fecha.getMinutes().toString().padStart(2, '0'); 
    return `${diaSemana} ${diaDelMes} ${mes} ${horas}:${minutos}`;
  }

export function formatNowLogin() {
    const fecha = new Date();
    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    return {
        fecha: fechaFormateada,
        hora: horaFormateada
    };
};