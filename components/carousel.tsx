import { cookies } from 'next/headers';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
async function getCollectionProducts() {
  try {
    const res = await fetch(`${baseUrl}/api/collection-products`, {
      credentials: 'include',
      headers: { Cookie: cookies().toString() }
    });
    return await res.json();
  } catch (error) {
    return undefined;
  }
}

export async function Carousel() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const products = (await getCollectionProducts())?.Items;

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.ID}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/product/${product.ID}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.Name}
                label={{
                  title: product.Name,
                  amount: product.PriceSchedule?.PriceBreaks?.at(0)?.Price?.toString() ?? '0',
                  currencyCode: product.xp.CurrencyCode
                }}
                src={product.xp?.Images?.at(0)?.Url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
