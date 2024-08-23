import React from 'react';
import ForgotPasswordEmail from '@/components/ForgotPasswordEmail/ForgotPasswordEmail';

const EmailPreview: React.FC = () => {
    const resetLink = "https://tu-sitio.com/reset-password?token=abc123";

    return (
        <ForgotPasswordEmail resetLink={resetLink} />
    );
};

export default EmailPreview;