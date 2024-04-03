'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addAddresses } from '../cart/actions';
import AddressInput from './addressform';
import SubmitButton from './submit-button';

export type Address = {
  firstName: string;
  lastName: string;
  street1: string;
  street2: string | undefined;
  zip: string;
  city: string;
  state: string;
  country: string;
  phone: string | undefined;
};

export default function Addresses({ className }: { className?: string }) {
  const [message, formAction] = useFormState(addAddresses, null);
  const [isChecked, setIsChecked] = useState(true);
  const { pending } = useFormStatus();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const open = searchParams.get('step') === null;
  const address1Storage = undefined; //localStorage?.getItem("billing-address");
  const address2Storage = undefined; //localStorage?.getItem("shipping-address");
  const [address1, setAddress1] = useState<Address | undefined>(
    address1Storage ? JSON.parse(address1Storage) : undefined
  );
  const [address2, setAddress2] = useState<Address | undefined>(
    address2Storage ? JSON.parse(address2Storage) : undefined
  );

  const onSubmitAddresses = async function (event: FormEvent<HTMLFormElement>) {
    if (pending) {
      event.preventDefault();
    } else {
      const formData = new FormData(event.currentTarget);
      const billingAddress: Address = {
        firstName: formData.get('billing-first-name') as string,
        lastName: formData.get('billing-last-name') as string,
        street1: formData.get('billing-street-1') as string,
        street2: formData.get('billing-street-2') as string,
        city: formData.get('billing-city') as string,
        state: formData.get('billing-state') as string,
        country: formData.get('billing-country') as string,
        zip: formData.get('billing-zip') as string,
        phone: formData.get('billing-phone') as string
      };
      const shippingAddress: Address = {
        firstName: formData.get('shipping-first-name') as string,
        lastName: formData.get('shipping-last-name') as string,
        street1: formData.get('shipping-street-1') as string,
        street2: formData.get('shipping-street-2') as string,
        city: formData.get('shipping-city') as string,
        state: formData.get('shipping-state') as string,
        country: formData.get('shipping-country') as string,
        zip: formData.get('shipping-zip') as string,
        phone: formData.get('shipping-phone') as string
      };
      setAddress1(billingAddress);
      setAddress2(shippingAddress);
      // localStorage?.setItem("billing-address", JSON.stringify(billingAddress));
      // localStorage?.setItem("shipping-address", JSON.stringify(shippingAddress));

      router.push(pathname + '?step=shipping', { scroll: false });
    }
  };
  return (
    <>
      <div className="mx-auto max-w-screen-2xl content-center px-4">
        <div className="mx-auto rounded border-gray-700 bg-gray-100 p-10">
          <div className="flex flex-row justify-between">
            <h2 className="mb-8 mt-8 text-xl font-bold">Address Details</h2>
            {!open && (
              <button
                onClick={() => {
                  router.push(pathname, { scroll: false });
                }}
              >
                Edit
              </button>
            )}
          </div>
          {!open && (
            <div className="flex w-full flex-row items-start justify-around">
              <div>
                <h3>Billing Address</h3>
                <br />
                <div className="flex flex-col">
                  <span>
                    {address1?.firstName} {address1?.lastName}
                  </span>
                  <span>
                    {address1?.street1} {address1?.street2}
                  </span>
                  <span>
                    {address1?.zip}, {address1?.city}
                  </span>
                  <span>{address1?.state}</span>
                  <span>{address1?.country?.toUpperCase()}</span>
                </div>
              </div>
              {address2?.firstName && (
                <div>
                  <h3>Shipping Address</h3>
                  <br />
                  <div className="flex flex-col">
                    <span>
                      {address2?.firstName} {address2?.lastName}
                    </span>
                    <span>
                      {address2?.street1} {address2?.street2}
                    </span>
                    <span>
                      {address2?.zip}, {address2?.city}
                    </span>
                    <span>{address2?.state}</span>
                    <span>{address2?.country?.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {open && (
            <form action={formAction} onSubmit={onSubmitAddresses}>
              <AddressInput data={address1} name="billing" />
              <div className="mb-4 flex items-center">
                <input
                  name="same-addresses"
                  id="same"
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked((prev) => !prev)}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="default-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Same as billing address
                </label>
              </div>
              {!isChecked && <AddressInput data={address2} name="shipping" />}
              <SubmitButton name="Continue" />
              <p aria-live="polite" className="sr-only" role="status">
                {message}
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
