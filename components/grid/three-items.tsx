import { cookies } from 'next/headers';
import Link from 'next/link';
import { BuyerProduct } from 'ordercloud-javascript-sdk';
import { GridTileImage } from './tile';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: BuyerProduct;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={`/product/${item.ID}`}>
        <GridTileImage
          src={item.xp?.Images?.at(0).Url}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.Name ?? 'missing'}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.Name as string,
            amount: item.PriceSchedule?.PriceBreaks?.at(0)?.Price?.toString() ?? '0',
            currencyCode: item.xp.CurrencyCode
          }}
        />
      </Link>
    </div>
  );
}

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

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts();
  if (
    !homepageItems?.Items ||
    !homepageItems.Items[0] ||
    !homepageItems.Items[1] ||
    !homepageItems.Items[2]
  )
    return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems.Items;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
