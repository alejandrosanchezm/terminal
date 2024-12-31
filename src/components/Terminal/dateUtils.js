export function formatNow() {
    const fecha = new Date(); // Usa la fecha actual o crea una específica
    const opciones = {
        weekday: 'long', // Día de la semana completo
        day: '2-digit',  // Día del mes con dos dígitos
        month: 'long',   // Mes completo
        year: 'numeric', // Año con cuatro dígitos
        hour: '2-digit', // Hora con dos dígitos
        minute: '2-digit', // Minuto con dos dígitos
        second: '2-digit', // Segundo con dos dígitos
        timeZoneName: 'short' // Nombre de la zona horaria
    };
    
    const formateador = new Intl.DateTimeFormat('es-ES', opciones);
    return formateador.format(fecha);
}

export function formatNowLocale() {
    return new Date().toLocaleString()
}
