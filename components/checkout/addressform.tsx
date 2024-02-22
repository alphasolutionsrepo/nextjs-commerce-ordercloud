'use client';

import { Address } from './addresses';
import Country from './countryselector';

export default function AddressInput({
  className,
  name,
  data
}: {
  className?: string;
  name: string;
  data: Address | undefined;
}) {
  return (
    <>
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-first-name`}
          >
            First Name
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border px-4 py-3 leading-tight text-gray-700 focus:outline-none"
            name={`${name}-first-name`}
            id={`${name}-first-name`}
            defaultValue={data?.firstName}
            type="text"
            placeholder="Jane"
            required
          />
        </div>
        <div className="w-full px-3 md:w-1/2">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-last-name`}
          >
            Last Name
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:outline-none"
            name={`${name}-last-name`}
            id={`${name}-last-name`}
            defaultValue={data?.lastName}
            type="text"
            placeholder="Doe"
            required
          />
        </div>
      </div>
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="mb-6 w-full px-3 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-street-1`}
          >
            Street 1
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border px-4 py-3 leading-tight text-gray-700 focus:outline-none"
            name={`${name}-street-1`}
            id={`${name}-street-1`}
            defaultValue={data?.street1}
            type="text"
            placeholder="Street 1"
            required
          />
        </div>
      </div>
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="mb-6 w-full px-3 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-street-2`}
          >
            Street 2
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border px-4 py-3 leading-tight text-gray-700 focus:outline-none"
            name={`${name}-street-2`}
            id={`${name}-street-2`}
            defaultValue={data?.street2}
            type="text"
            placeholder="Street 2"
          />
        </div>
      </div>
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="mb-6 w-full px-3 md:mb-0">
          <Country name={name}></Country>
        </div>
      </div>
      <div className="-mx-3 mb-2 flex flex-wrap">
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-city`}
          >
            City
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:outline-none"
            name={`${name}-city`}
            id={`${name}-city`}
            defaultValue={data?.city}
            type="text"
            placeholder="Albuquerque"
            required
          />
        </div>
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-state`}
          >
            State
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:outline-none"
            name={`${name}-state`}
            id={`${name}-state`}
            defaultValue={data?.state}
            type="text"
            placeholder="New Mexico"
            required
          />
        </div>
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-zip`}
          >
            Zip
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:outline-none"
            name={`${name}-zip`}
            id={`${name}-zip`}
            defaultValue={data?.zip}
            type="text"
            placeholder="90210"
            required
          />
        </div>
      </div>
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`${name}-phone`}
          >
            Phone
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border px-4 py-3 leading-tight text-gray-700 focus:outline-none"
            name={`${name}-phone`}
            id={`${name}-phone`}
            defaultValue={data?.phone}
            type="tel"
            placeholder="12345678"
          />
        </div>
      </div>
    </>
  );
}
