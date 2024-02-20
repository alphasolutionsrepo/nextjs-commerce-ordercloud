'use client';
import Footer from 'components/layout/footer';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default async function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <>
      <div className="mx-auto flex w-2/3 flex-row rounded bg-white">
        Congrats on order {orderId} you will receive an email as soon as the order has been
        confirmed.
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
