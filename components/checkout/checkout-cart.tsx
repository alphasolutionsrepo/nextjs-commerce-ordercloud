import { getDetails } from 'components/cart/actions';
import { MerchandiseSearchParams } from 'components/cart/modal';
import Price from 'components/price';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function CheckoutCart({ className }: { className?: string }) {
  const cart = await getDetails();

  return (
    <>
      <div className="sticky top-0 mx-auto max-w-screen-2xl content-center px-4">
        <div className="mx-auto rounded border-gray-700 bg-gray-100 p-10">
          <div className="flex flex-row justify-between">
            <h2 className="mb-8 mt-8 text-xl font-bold">Cart</h2>
          </div>
          {cart?.order && cart?.lines && cart.lines?.length > 0 && (
            <div>
              <ul>
                {cart?.lines?.map((line, i) => {
                  const merchandiseSearchParams = {} as MerchandiseSearchParams;

                  line.Specs?.forEach((spec) => {
                    if (spec.Name && spec.Value) {
                      merchandiseSearchParams[spec.Name?.toLowerCase()] = spec.Value;
                    }
                  });
                  const merchandiseUrl = createUrl(
                    `/product/${line.ProductID}`,
                    new URLSearchParams(merchandiseSearchParams)
                  );

                  return (
                    <li key={i} className="flex w-full flex-col">
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <Link href={merchandiseUrl} className="z-30 flex flex-row space-x-4">
                          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            {line.Product?.xp?.Images.at(0)?.Url && (
                              <Image
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={(line.Variant?.Name || line.Product?.Name) as string}
                                src={
                                  (line.Variant?.xp?.Images.at(0)?.Url ||
                                    line.Product?.xp?.Images.at(0)?.Url) as string
                                }
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col text-base">
                            <span className="leading-tight">{line.Product?.Name}</span>
                            {line.Product?.Name !== line.Variant?.Name ? (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {line.Variant?.Name}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                        <div className="flex h-16 flex-col justify-between">
                          <Price
                            className="flex justify-end space-y-2 text-right text-sm"
                            amount={line.LineTotal?.toString() ?? ''}
                            currencyCode={cart.order.Currency ?? 'USD'}
                          />
                          <div className="ml-auto flex h-9 flex-row items-center">
                            <p className="text-center">
                              <span className="w-full text-sm">quantity: {line.Quantity}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
