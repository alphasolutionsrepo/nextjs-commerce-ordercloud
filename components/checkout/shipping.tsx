'use client';
import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addShippingMethod } from '../cart/actions';
import SubmitButton from './submit-button';

export default function Shipping({ className }: { className?: string }) {
  const [message, formAction] = useFormState(addShippingMethod, null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shippingMethods = [
    { id: '1', name: 'method 1' },
    { id: '2', name: 'method 2' },
    { id: '3', name: 'method 3' }
  ];
  const [selectedMethod, setSelectedMethod] = useState(shippingMethods.at(0));
  const { pending } = useFormStatus();
  const open = searchParams.get('step') === 'shipping';

  const onSubmitShipping = async function (event: FormEvent<HTMLFormElement>) {
    if (pending) {
      event.preventDefault();
    } else {
      const formData = new FormData(event.currentTarget);
      const id = formData.get('shipping-method') as string;
      setSelectedMethod(shippingMethods.find((x) => x.id == id));
      // localStorage.setItem("shipping-method", formData.get("shipping-method[id]") as string);

      router.push(pathname + '?step=payment', { scroll: false });
    }
  };
  return (
    <>
      <div className="mx-auto content-center px-4">
        <div className="mx-auto rounded border-gray-700 bg-gray-100 p-10">
          <div className="flex flex-row justify-between">
            <h2 className="mb-8 mt-8 text-xl font-bold">Shipping Details</h2>
            {!open && (
              <button
                onClick={() => {
                  router.push(pathname + '?step=shipping', { scroll: false });
                }}
              >
                Edit
              </button>
            )}
          </div>
          {!open && (
            <div className="flex w-full flex-row items-start justify-around">
              <div className="flex flex-col">
                <br />
                <div>{selectedMethod?.name}</div>
              </div>
            </div>
          )}
          {open && (
            <form action={formAction} onSubmit={onSubmitShipping}>
              <div className=" mb-6">
                <RadioGroup name="shipping-method" defaultValue={selectedMethod?.id}>
                  {shippingMethods.map((method) => (
                    <RadioGroup.Option
                      key={method.id}
                      value={method.id}
                      className="ml-10 mr-10 mt-4 flex flex-col"
                    >
                      {({ checked }) => (
                        <div
                          className={clsx(
                            'flex flex-row justify-center rounded border p-2',
                            checked ? 'bg-blue-600 text-white' : 'bg-white'
                          )}
                        >
                          <span>{method.name}</span>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
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
