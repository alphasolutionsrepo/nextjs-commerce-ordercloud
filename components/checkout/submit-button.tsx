import { ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';
import LoadingDots from '../loading-dots';

export default function SubmitButton({ name, className }: { name: string; className?: string }) {
  const { pending } = useFormStatus();
  const buttonClasses = clsx(
    'mx-auto relative flex w-1/4 items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white',
    className
  );
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  return (
    <button
      type="submit"
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
      {name}
      <div className="absolute right-0 mr-4">
        {pending ? <></> : <ArrowRightIcon className="h-5" />}
      </div>
    </button>
  );
}
