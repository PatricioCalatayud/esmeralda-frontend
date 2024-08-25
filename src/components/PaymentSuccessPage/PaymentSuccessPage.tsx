import React, { Suspense } from 'react';
import PaymentSuccess from '@/app/PaymentSuccess/page';

const PaymentSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
};

export default PaymentSuccessPage;