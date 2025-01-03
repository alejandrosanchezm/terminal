.terminal-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.02;
  mix-blend-mode: screen;
}


.terminal-container {
  /* Ocupa toda la pantalla */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #4115502e;
  color: #0f0;
  /* Texto verde retro */
  font-family: "Fira Code", monospace;
  padding: 1rem;
  overflow-y: auto;
  /* Scroll si se llena mucho */
  animation: crtFlicker 5s infinite;
  outline: none;
  /* Quita el outline al enfocar */
}

.terminal-line {
  white-space: pre;
  /* Para respetar espacios */
  text-align: left;
  /* Texto a la izquierda */
}

.cursor {
  display: inline-block;
  width: 2px;
  background-color: #ffffffbb;
  margin-left: 4px;
  margin-top: 2px;
  animation: blink 1s infinite;
  height: 18px;
  border-radius: 5px;
}

/* Efecto de parpadeo del cursor */
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.terminal-container::after {
  content: "";
  pointer-events: none;
  /* Para que no afecte clicks, etc. */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* Repetimos líneas cada 2px o 3px, para simular el barrido.
       Ajusta la opacidad y color a tu gusto. */
  background: repeating-linear-gradient(to bottom,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 3px);

  /* mix-blend-mode determina cómo se mezclan 
       estas líneas con el fondo */
  mix-blend-mode: overlay;
  opacity: 0.07;
  /* Ajusta la intensidad de las líneas */
}

.terminal-line {
  margin: 0.2rem 0;
  text-align: left;

  /* Pequeño brillo verde */
  text-shadow:
    0 0 2px #0f0,
    0 0 5px #0f0;
}

@keyframes crtFlicker {
  0% {
    opacity: 0.98;
  }

  5% {
    opacity: 1;
  }

  10% {
    opacity: 0.97;
  }

  15% {
    opacity: 1;
  }

  100% {
    opacity: 0.98;
  }
}

.crt-flicker {
  animation: crtFlicker 5s infinite;
}

/* Contenedor general */
.tv-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  /* Ocupa la ventana completa */
  background: #222;
  /* Un fondo gris oscuro, si quieres */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.turn-off-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  cursor: pointer;
}

/* Contenedor de la "pantalla" */
.tv-screen {
  width: 80%;
  height: 80%;
  background: #000;
  position: relative;
  overflow: hidden;
  /* Importante para que no se vea nada "afuera" */
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  /* Estilo retro, opcional */
}

/* 
  Al añadir .tv-off, ejecutamos la animación de apagado 
  (CRT "shutoff" effect).
*/
.tv-off {
  animation: tv-off 1s forwards;
  /* 'forwards' para que se mantenga en el estado final */
}

/*
  La animación reduce la escala vertical de 1 a 0,
  y jugamos con la opacidad para hacer la "línea blanca".
*/
@keyframes tv-off {
  0% {
    transform: scaleY(1);
    opacity: 1;
  }

  70% {
    transform: scaleY(0.05);
    opacity: 1;
    /* Podemos forzar que la 'línea' sea blanca aquí */
    background: #fff;
  }

  90% {
    transform: scaleY(0.01);
    opacity: 0.7;
  }

  100% {
    transform: scaleY(0);
    opacity: 0;
  }
}

.terminal-line {
  padding: 2px 0;
}

/* Comandos del usuario en color blanco */
.command-line {
  color: #0f0;
}

/* Respuestas del sistema en verde (o el color que prefieras) */
.output-line {
  color: #fff;

}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.terminal-line {
  display: flex;
  /* Permite alinear elementos hijos en una fila */
  align-items: center;
  /* Alinea verticalmente los elementos */
}

.password-line {
  width: fit-content;
  /* Mantiene el ancho ajustado al contenido */
  margin-right: 10px;
  /* Da espacio entre la línea y el comando */
}

.password-command {
  margin-left: 10px;
  /* Añade un pequeño espacio desde la línea */
  color: #00ff00;
  /* Ejemplo de estilo adicional */
  white-space: nowrap;
  /* Evita el salto de línea */
}