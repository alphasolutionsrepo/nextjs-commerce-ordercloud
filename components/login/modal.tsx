'use client';
import { Dialog, Transition } from '@headlessui/react';
import { UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { MeUser } from 'ordercloud-javascript-sdk';
import { Fragment, useState } from 'react';
import LoginForm from './login';
import UserInfo from './user-info';

export default function UserModal({
  user,
  className
}: {
  user: MeUser | undefined;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);
  const anonId = 'anonymous-shopper'; // minor hack

  const validUser = user && user.ID != anonId;
  return (
    <>
      <div className={clsx('', className)}>
        <button aria-label="Login" onClick={openLogin}>
          <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
            <UserIcon className={'h-4 transition-all ease-in-out hover:scale-110 '} />
          </div>
        </button>
        <Transition show={isOpen}>
          <Dialog onClose={closeLogin} className="relative z-50">
            <Transition.Child
              as={Fragment}
              enter="transition-all ease-in-out duration-300"
              enterFrom="opacity-0 backdrop-blur-none"
              enterTo="opacity-100 backdrop-blur-[.5px]"
              leave="transition-all ease-in-out duration-200"
              leaveFrom="opacity-100 backdrop-blur-[.5px]"
              leaveTo="opacity-0 backdrop-blur-none"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition-all ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition-all ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{validUser ? 'User' : 'Login'}</p>

                  <button aria-label="Close cart" onClick={closeLogin}>
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
                      <XMarkIcon className="h-6 transition-all ease-in-out hover:scale-110" />
                    </div>
                  </button>
                </div>
                {!validUser && <LoginForm />}
                {validUser && <UserInfo user={user} />}
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}
