import React from 'react';

const ForgotPasswordEmail: React.FC<{ resetLink: string }> = ({ resetLink }) => {
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f4f4',
            margin: 0,
            padding: 0,
            color: '#333',
            width: '100%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center', // Centra el contenido en todo el div
        }}>
            <div style={{ paddingBottom: '20px' }}>
                <img src="logo.png" alt="Logo de la empresa" style={{ maxWidth: '150px', margin: '0 auto', display: 'block' }} />
            </div>
            <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
                <p>Hola,</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, simplemente ignora este correo.</p>
                <p>Para restablecer tu contraseña, haz clic en el botón a continuación:</p>
                <a href={resetLink} style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    marginTop: '20px',
                    fontSize: '16px',
                    color: '#ffffff',
                    backgroundColor: '#38b2ac', // Color teal 500 o parecido
                    textDecoration: 'none',
                    borderRadius: '5px',
                    textAlign: 'center' // Asegura que el texto esté centrado en el botón
                }}>Restablecer Contraseña</a>
                <p>Si tienes problemas para hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
                <p><a href={resetLink}>{resetLink}</a></p>
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
                <p>© 2024 La Esmeralda Cafe. Todos los derechos reservados.</p>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;