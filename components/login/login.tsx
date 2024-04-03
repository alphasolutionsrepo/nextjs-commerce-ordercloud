'use client';
import { useFormState } from 'react-dom';
import { login } from '../cart/actions';
import SubmitButton from '../checkout/submit-button';

export default function LoginForm() {
  const [message, formAction] = useFormState(login, null);
  return (
    <div className="">
      <form action={formAction}>
        <div className="mb-6 w-full px-3 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`username`}
          >
            Username
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border px-4 py-3 leading-tight text-gray-700 focus:outline-none"
            name={`username`}
            id={`username`}
            type="text"
            required
          />
        </div>
        <div className="mb-6 w-full px-3 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor={`password`}
          >
            Password
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border px-4 py-3 leading-tight text-gray-700 focus:outline-none"
            name={`password`}
            id={`password`}
            type="password"
            required
          />
          <p aria-live="polite" className="mb-2 mt-2 text-red-600" role="status">
            {message}
          </p>
        </div>
        <SubmitButton name="Login" className="!w-1/2" />
      </form>
    </div>
  );
}
