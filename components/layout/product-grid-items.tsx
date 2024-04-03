import Link from 'next/link';
import { BuyerProduct } from 'ordercloud-javascript-sdk';
import Grid from '../grid';
import { GridTileImage } from '../grid/tile';

export default function ProductGridItems({ products }: { products: BuyerProduct[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.ID} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/product/${product.ID}`}>
            <GridTileImage
              alt={product.Name ?? ''}
              label={{
                title: product.Name ?? '',
                amount: product.PriceSchedule?.PriceBreaks?.at(0)?.Price?.toString() ?? '0',
                currencyCode: product.xp.CurrencyCode
              }}
              src={product.xp.Images?.length > 0 ? product.xp.Images[0].Url : null}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
