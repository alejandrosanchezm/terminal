import Window from '../Window';
import { useState } from 'react';
import './style.css';

// eslint-disable-next-line react/prop-types
export default function Navigator(props) {

  return (
    <Window title="Chrome" {...props}>
      <BrowserSimulation />
    </Window>
  )
}

const BrowserSimulation = () => {
  // Estado para la URL y el valor del input
  const [url, setUrl] = useState('https://github.com/alejandrosanchezm');
  const [validUrl, setValidUrl] = useState(true);

  // Función para manejar cambios en el campo de entrada
  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  // Función para verificar si la URL es válida
  const validateUrl = (inputUrl) => {
    const regex = /^(http|https):\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
    return regex.test(inputUrl);
  };

  // Manejar el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar la URL antes de intentar cargarla en el iframe
    if (validateUrl(url)) {
      setValidUrl(true);
    } else {
      setValidUrl(false);
    }
  };

  return (
    <div style={{ width: "100%", margin: "auto", paddingTop: "0px" }}>
      <div className="navigator-header">
        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Introduce una URL"
            value={url}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "10px" }}
          />
          <button type="submit" style={{ padding: "10px", borderRadius: "0px" }}>
            Cargar
          </button>
        </form>
      </div>
      {/* El contenido debajo del header tiene que estar desplazado para no estar cubierto */}
      <div className="navigator-container">
        {validUrl && url && (
          <iframe
            src={url}
            width="100%"
            height="500"
            title="Simulación de Navegador"
            style={{ border: "1px solid #ccc" }}
          />
        )}
      </div>
    </div>
  );
};