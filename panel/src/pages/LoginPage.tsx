import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/auth'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { loginContext } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const data = await login(email, contrasena)
      const usuario = JSON.parse(atob(data.access_token.split('.')[1]))
      loginContext(data.access_token, {
        id: usuario.id,
        nombre: usuario.sub.split('@')[0],
        email: usuario.sub,
        rol: usuario.rol
      })
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          background: #2A1A0E;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        /* Fondo decorativo */
        .login-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(92,61,46,0.6) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,146,42,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Líneas decorativas de fondo */
        .login-page::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 60px,
              rgba(201,146,42,0.03) 60px,
              rgba(201,146,42,0.03) 61px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(201,146,42,0.03) 60px,
              rgba(201,146,42,0.03) 61px
            );
          pointer-events: none;
        }

        /* Tarjeta principal */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          background: #FDF8F0;
          border: 1px solid rgba(201,146,42,0.3);
          box-shadow: 
            0 0 0 1px rgba(201,146,42,0.1),
            0 40px 80px rgba(0,0,0,0.5),
            0 0 120px rgba(201,146,42,0.05);
          animation: cardEntrance 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Franja dorada superior */
        .card-top-bar {
          height: 3px;
          background: linear-gradient(to right, transparent, #C9922A 30%, #E8C46A 50%, #C9922A 70%, transparent);
        }

        /* Sección del logo */
        .card-logo-section {
          background: #5C3D2E;
          padding: 40px 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeInDown 0.8s 0.2s both;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-logo-section img {
          width: 180px;
          object-fit: contain;
          margin-bottom: 20px;
        }

        .card-logo-label {
          color: rgba(240,224,184,0.6);
          font-size: 10px;
          letter-spacing: 6px;
          text-transform: uppercase;
        }

        /* Separador con rombo */
        .card-separator {
          height: 24px;
          background: #5C3D2E;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          position: relative;
        }

        .card-separator::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 24px;
          height: 24px;
          background: #5C3D2E;
          border-right: 1px solid rgba(201,146,42,0.3);
          border-bottom: 1px solid rgba(201,146,42,0.3);
        }

        /* Sección del formulario */
        .card-form-section {
          padding: 48px 40px 40px;
          animation: fadeInUp 0.8s 0.4s both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-form-section h1 {
          font-size: 32px;
          font-weight: 300;
          color: #5C3D2E;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .card-form-section .subtitle {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9922A;
          margin-bottom: 32px;
        }

        .error-msg {
          background: #FFF5F5;
          border-left: 2px solid #C9922A;
          color: #8B3A3A;
          font-size: 13px;
          padding: 10px 14px;
          margin-bottom: 24px;
          letter-spacing: 0.3px;
        }

        .field {
          margin-bottom: 24px;
        }

        .field label {
          display: block;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9922A;
          margin-bottom: 8px;
        }

        .field input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #E0C9A0;
          background: transparent;
          padding: 10px 0;
          font-size: 16px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #5C3D2E;
          outline: none;
          transition: border-color 0.3s;
        }

        .field input::placeholder {
          color: rgba(92,61,46,0.25);
        }

        .field input:focus {
          border-bottom-color: #C9922A;
        }

        .submit-btn {
          width: 100%;
          background: #5C3D2E;
          color: #F0E0B8;
          border: none;
          padding: 15px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #C9922A, transparent);
          transform: scaleX(0);
          transition: transform 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #4A2E1E;
        }

        .submit-btn:hover:not(:disabled)::after {
          transform: scaleX(1);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Franja dorada inferior */
        .card-bottom-bar {
          height: 2px;
          background: linear-gradient(to right, transparent, #C9922A 30%, #E8C46A 50%, #C9922A 70%, transparent);
        }

        /* Responsive móvil */
        @media (max-width: 480px) {
          .card-logo-section { padding: 32px 24px 24px; }
          .card-logo-section img { width: 150px; }
          .card-form-section { padding: 40px 24px 32px; }
          .card-form-section h1 { font-size: 28px; }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">

          {/* Barra dorada superior */}
          <div className="card-top-bar" />

          {/* Logo */}
          <div className="card-logo-section">
            <img src="/GRANADA.png" alt="Artesanía Albaicín" />
            <span className="card-logo-label">Panel de gestión</span>
          </div>

          {/* Punta decorativa */}
          <div className="card-separator" />

          {/* Formulario */}
          <div className="card-form-section">
            <h1>Bienvenido</h1>
            <p className="subtitle">Acceso privado</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>
              <div className="field">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={cargando} className="submit-btn">
                {cargando ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          {/* Barra dorada inferior */}
          <div className="card-bottom-bar" />

        </div>
      </div>
    </>
  )
}

export default LoginPage