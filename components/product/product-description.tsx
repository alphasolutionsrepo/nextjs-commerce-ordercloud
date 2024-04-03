import { BuyerProduct, Spec, Variant } from 'ordercloud-javascript-sdk';
import { AddToCart } from '../cart/add-to-cart';
import Price from '../price';
import { VariantSelector } from './variant-selector';

export async function ProductDescription({
  product,
  variants,
  specs
}: {
  product: BuyerProduct;
  variants: Variant[] | undefined;
  specs: Spec[] | undefined;
}) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.Name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.PriceSchedule?.PriceBreaks?.at(0)?.Price?.toString() ?? '0'}
            currencyCode={product.xp.CurrencyCode ?? 'USD'}
          />
        </div>
      </div>
      {product.VariantCount == 0 && <></>}
      <VariantSelector specs={specs} variants={variants} />

      {/* {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null} */}

      <AddToCart product={product} variants={variants} availableForSale={Boolean(product.Active)} />
    </>
  );
}
