'use client';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addAddresses } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import AddressInput from './addressform';

function SubmitButton() {
  const { pending } = useFormStatus();
  const router = useRouter();
  const pathname = usePathname();
  const buttonClasses =
    'mx-auto relative flex w-1/4 items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) {
          e.preventDefault();
        } else {
          router.push(pathname + '?step=shipping', { scroll: false });
        }
      }}
      aria-label="Continue"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <></>}
      </div>
      Continue
      <div className="absolute right-0 mr-4">
        {pending ? <></> : <ArrowRightIcon className="h-5" />}
      </div>
    </button>
  );
}
export default function Addresses({ className }: { className?: string }) {
  const [message, formAction] = useFormState(addAddresses, null);
  const [isChecked, setIsChecked] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const open = searchParams.get('step') === null;
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
          {open && (
            <form action={formAction}>
              <AddressInput name="billing" />
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
              {!isChecked && <AddressInput name="shipping" />}
              <SubmitButton />
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
