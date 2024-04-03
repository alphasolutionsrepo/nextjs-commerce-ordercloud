import { Suspense } from 'react';
import { Carousel } from '../components/carousel';
import { ThreeItemGrid } from '../components/grid/three-items';
import Footer from '../components/layout/footer';

// export const runtime = 'edge';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and -.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Suspense>
        <Carousel />
        <Suspense>
          <Footer />
        </Suspense>
      </Suspense>
    </>
  );
}
