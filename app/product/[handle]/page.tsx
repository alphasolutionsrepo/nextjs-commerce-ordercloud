import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
//import { getProduct, getProductRecommendations } from 'lib/shopify';
import Footer from 'components/layout/footer';
import { getProduct, getSpecs, getVariants } from 'lib/order-cloud';

// export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  // const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = product.Active && product.xp.Status != 'Draft';

  return {
    title: product.Name,
    description: product.Description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    }
    // openGraph: url
    //   ? {
    //       images: [
    //         {
    //           url,
    //           width,
    //           height,
    //           alt
    //         }
    //       ]
    //     }
    //   : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  let variants, specs;
  if (product?.VariantCount !== 0 && product?.ID) {
    variants = await getVariants(product.ID);
    specs = await getSpecs(product.ID);
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.Name,
    description: product.Description,
    image: product.xp.Images?.length > 0 ? product.xp.Images[0].Url : null,
    offers: {
      '@type': 'AggregateOffer',
      availability:
        product.Inventory != null ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceCurrency: product.xp.CurrencyCode
      // highPrice: prices?.PriceBreaks[0]?.Price,
      // lowPrice: prices?.PriceBreaks[0]?.Price
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={product.xp.Images.map((image: any) => ({
                src: image.Url
              }))}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} variants={variants} specs={specs} />
          </div>
        </div>
        <Suspense>{/* <RelatedProducts id={product.product.ID} /> */}</Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

// async function RelatedProducts({ id }: { id: string, categoryId: string }) {
//   const relatedProducts = (await getProductRecommendations(id, categoryId))?.Items;

//   if (!relatedProducts.length) return null;

//   return (
//     <div className="py-8">
//       <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
//       <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//         {relatedProducts.map((product) => (
//           <li
//             key={product.ID}
//             className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
//           >
//             <Link className="relative h-full w-full" href={`/product/${product.ID}`}>
//               <GridTileImage
//                 alt={product.Name}
//                 label={{
//                   title: product.Name,
//                   amount: product.priceRange.maxVariantPrice.amount,
//                   currencyCode: product.priceRange.maxVariantPrice.currencyCode
//                 }}
//                 src={product.xp?.Images[0].Url}
//                 fill
//                 sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
//               />
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
