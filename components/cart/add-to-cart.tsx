'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { useSearchParams } from 'next/navigation';
import { BuyerProduct, Variant, VariantSpec } from 'ordercloud-javascript-sdk';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  productId,
  selectedVariantSpecs
}: {
  availableForSale: boolean;
  productId: string | undefined;
  selectedVariantSpecs: VariantSpec[] | undefined;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!productId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  product,
  variants,
  availableForSale
}: {
  product: BuyerProduct;
  variants: Variant[] | undefined;
  availableForSale: boolean;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();
  const variant = variants?.find(
    (variant: Variant) =>
      variant.Specs?.every(
        (spec) => spec.Name && spec.Value === searchParams.get(spec.Name.toLowerCase())
      )
  );
  const payload = {
    productId: product.ID,
    variantSpecs: variant?.Specs
  };

  const actionWithVariant = formAction.bind(null, payload);

  return (
    <form action={actionWithVariant}>
      <SubmitButton
        availableForSale={availableForSale}
        productId={product.ID}
        selectedVariantSpecs={variant?.Specs}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
