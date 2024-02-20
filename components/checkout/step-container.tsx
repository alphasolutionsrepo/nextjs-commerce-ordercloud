import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import { ReactNode } from 'react';

export default function StepContainer({
  className,
  name,
  children,
  state
}: {
  className?: string;
  name: string;
  children: ReactNode;
  state: boolean;
}) {
  return (
    <div className={clsx('mx-auto max-w-screen-2xl content-center px-4', className)}>
      <h2>{name}</h2>
      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            'overflow-hidden transition-[max-height,opacity] duration-700 ease-in-out',
            {
              'max-h-[9999px] opacity-100': !state,
              'max-h-0 opacity-0': state
            }
          )}
        >
          {children}
        </Disclosure.Panel>
        <Disclosure.Panel
          static
          className={clsx(
            'overflow-hidden transition-[max-height,opacity] duration-700 ease-in-out',
            {
              'max-h-[9999px] opacity-100': state,
              'max-h-0 opacity-0': !state
            }
          )}
        >
          done
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}
