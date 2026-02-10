import React, { useState } from 'react';
const url = import.meta.env.VITE_URL;

/**
 * Componente de página para recuperación de contraseña
 * Maneja el proceso de dos pasos: solicitud de código y cambio de contraseña
 */
export const ForgotPassword = () => {
    const [step, setStep] = useState(1); 
    const [correo, setCorreo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    /**
     * Maneja la solicitud de código de verificación
     * Envía el correo al backend para que genere y envíe un código
     */
    const handleSolicitarCodigo = async (e) => {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' });

        /**
         * Validar que se haya ingresado un correo electrónico
         */
        if (!correo.trim()) {
            setMensaje({ tipo: 'error', texto: 'Por favor ingresa tu correo electrónico' });
            return;
        }

        setLoading(true);

        try {
            /**
             * Realizar petición POST para solicitar el código de recuperación
             */
            const response = await fetch(url+'/user/solicitarCambioContrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo }),
            });

            const data = await response.json();

            /**
             * Si el código se envió exitosamente, avanzar al paso 2
             */
            if (data.success) {
                setMensaje({ tipo: 'success', texto: 'Código enviado a tu correo. Revisa tu bandeja de entrada.' });
                setTimeout(() => {
                    setStep(2);
                    setMensaje({ tipo: '', texto: '' });
                }, 2000);
            } else {
                setMensaje({ tipo: 'error', texto: data.error || 'Error al enviar el código' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje({ tipo: 'error', texto: 'Error de conexión. Intenta nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el cambio de contraseña usando el código de verificación
     * Valida los datos y envía la petición para actualizar la contraseña
     */
    const handleCambiarContrasena = async (e) => {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' });

        /**
         * Validar que todos los campos estén completos
         */
        if (!codigo.trim() || !nuevaContrasena.trim() || !confirmarContrasena.trim()) {
            setMensaje({ tipo: 'error', texto: 'Por favor completa todos los campos' });
            return;
        }

        /**
         * Validar que las contraseñas coincidan
         */
        if (nuevaContrasena !== confirmarContrasena) {
            setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
            return;
        }

        /**
         * Validar longitud mínima de la contraseña
         */
        if (nuevaContrasena.length < 6) {
            setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }

        setLoading(true);

        try {
            /**
             * Realizar petición PUT para cambiar la contraseña
             */
            const response = await fetch(url+'/user/cambiarContrasena', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo,
                    codigo,
                    nuevaContrasena,
                }),
            });

            const data = await response.json();

            /**
             * Si el cambio fue exitoso, redirigir al login después de 2 segundos
             */
            if (data.success) {
                setMensaje({ tipo: 'success', texto: '¡Contraseña actualizada exitosamente!' });
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 2000);
            } else {
                setMensaje({ tipo: 'error', texto: data.error || 'Error al cambiar la contraseña' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje({ tipo: 'error', texto: 'Error de conexión. Intenta nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el retorno al paso 1 desde el paso 2
     * Limpia los campos del formulario de cambio de contraseña
     */
    const handleVolver = () => {
        setStep(1);
        setCodigo('');
        setNuevaContrasena('');
        setConfirmarContrasena('');
        setMensaje({ tipo: '', texto: '' });
    };

    return (
        <div className="forgotPassword">
            <div className="forgot-card">
                {step === 1 ? (
                    <>
                        <h1 className="forgot-title">¿Olvidaste tu contraseña?</h1>
                        <p className="forgot-subtitle">
                            Ingresa tu correo y te enviaremos un código de verificación
                        </p>

                        <form className="forgot-form" onSubmit={handleSolicitarCodigo}>
                            <div className="form-group">
                                <label htmlFor="correo">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="correo"
                                    placeholder="tu@correo.com"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {mensaje.texto && (
                                <div className={`mensaje mensaje-${mensaje.tipo}`}>
                                    {mensaje.texto}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-forgot"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar código'}
                            </button>

                            <button
                                type="button"
                                className="btn-volver-login"
                                onClick={() => window.location.href = '/login'}
                                disabled={loading}
                            >
                                Volver al inicio de sesión
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="forgot-title">Cambiar contraseña</h1>
                        <p className="forgot-subtitle">
                            Ingresa el código que enviamos a <strong>{correo}</strong>
                        </p>

                        <form className="forgot-form" onSubmit={handleCambiarContrasena}>
                            <div className="form-group">
                                <label htmlFor="codigo">Código de verificación</label>
                                <input
                                    type="text"
                                    id="codigo"
                                    placeholder="Ej: A1B2C3"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                    disabled={loading}
                                    maxLength={6}
                                    style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nuevaContrasena">Nueva contraseña</label>
                                <input
                                    type="password"
                                    id="nuevaContrasena"
                                    placeholder="Mínimo 6 caracteres"
                                    value={nuevaContrasena}
                                    onChange={(e) => setNuevaContrasena(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    id="confirmarContrasena"
                                    placeholder="Repite tu contraseña"
                                    value={confirmarContrasena}
                                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {mensaje.texto && (
                                <div className={`mensaje mensaje-${mensaje.tipo}`}>
                                    {mensaje.texto}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-forgot"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                            </button>

                            <button
                                type="button"
                                className="btn-volver-login"
                                onClick={handleVolver}
                                disabled={loading}
                            >
                                Volver atrás
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};