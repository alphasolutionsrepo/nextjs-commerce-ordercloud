import Addresses from 'components/checkout/addresses';
import CheckoutCart from 'components/checkout/checkout-cart';
import ConfirmOrder from 'components/checkout/confirm-order';
import Payment from 'components/checkout/payment';
import Shipping from 'components/checkout/shipping';
import Footer from 'components/layout/footer';
import { Suspense } from 'react';

// function SubmitButton() {
//     const { pending } = useFormStatus();
//     const buttonClasses =
//         'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
//     const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

//     return (
//         <button
//           onClick={(e: React.FormEvent<HTMLButtonElement>) => {
//             if (pending) e.preventDefault();
//           }}
//           aria-label="Submit billing address"
//           aria-disabled={pending}
//           className={clsx(buttonClasses, {
//             'hover:opacity-90': true,
//             disabledClasses: pending
//           })}
//         >
//           <div className="absolute left-0 ml-4">
//             {pending ? <LoadingDots className="mb-3 bg-white" /> : <></>}
//           </div>
//           Submit Billing Address
//           <div className="absolute right-0 mr-4">
//             {pending ? <></> : <ArrowRightIcon className="h-5" />}
//           </div>
//         </button>
//       );
//   }

export default async function CheckoutPage() {
  // const [message, formAction] = useFormState(addBillingAddress, null);

  return (
    <>
      <div className="mx-auto flex w-2/3 flex-row">
        <div className="m-10 w-2/3 content-center">
          <Addresses />
          <Shipping />
          <Payment />
          <ConfirmOrder />
        </div>
        <div className="mt-10 w-1/3">
          <Suspense>
            <CheckoutCart />
          </Suspense>
        </div>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
