/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { formatNowLogin } from '../../utils/date';
import './style.css';

export default function Login({ setIsLoggedIn }) {
    // Estado para el nombre de usuario y el mensaje de error (si aplica)
    const [username, setUsername] = useState('');
    const [error, setError] = useState('Por favor, ingresa un nombre de usuario.');

    // Maneja el cambio del valor del input
    const handleInputChange = (e) => {
        setUsername(e.target.value);
        if (e.target.value.trim() === '') {
            setError('Por favor, ingresa un nombre de usuario.');
        } else {
            setError('');
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() === '') {
            setError('Por favor, ingresa un nombre de usuario válido.');
            setIsLoggedIn(false);
        } else {
            setError('');
            setIsLoggedIn(true);
        }
    };

    let date = formatNowLogin();

    return (
        <div className="login-screen">
            <div className="login-datetime">
                <span className="login-date">{date.fecha}</span>
                <span className="login-time">{date.hora}</span>
            </div>
            
            <div className="login-container">
                <div className="login-profile">
                    <img src="profile.png" />
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleInputChange}
                            placeholder="Nombre de usuario"
                            className={error != "" ? "shake" : ""}
                        />
                        <button type="submit" className="submit-btn">
                            <span className="chevron">&#10132;</span>
                        </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>

    );
}
