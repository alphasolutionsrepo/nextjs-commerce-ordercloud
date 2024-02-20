import { ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addPaymentMethod } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

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
          router.push(pathname + '?step=confirm', { scroll: false });
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

export default function Payment({ className }: { className?: string }) {
  const [message, formAction] = useFormState(addPaymentMethod, null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const open = searchParams.get('step') === 'payment';
  return (
    <>
      <div className="mx-auto max-w-screen-2xl content-center px-4">
        <div className="mx-auto rounded border-gray-700 bg-gray-100 p-10">
          <div className="flex flex-row justify-between">
            <h2 className="mb-8 mt-8 text-xl font-bold">Payment Details</h2>
            {!open && (
              <button
                onClick={() => {
                  router.push(pathname + '?step=payment', { scroll: false });
                }}
              >
                Edit
              </button>
            )}
          </div>
          {open && (
            <form action={formAction}>
              <div className="-mx-3 mb-6 flex flex-wrap"></div>
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
