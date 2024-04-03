'use client';
import { MeUser } from 'ordercloud-javascript-sdk';
import { useFormState } from 'react-dom';
import { logout } from '../cart/actions';
import SubmitButton from '../checkout/submit-button';

export default function UserInfo({ user }: { user: MeUser }) {
  const [message, formAction] = useFormState(logout, null);

  return (
    <>
      <div className="m-4 flex flex-col">
        <div className="">{`${user.FirstName} ${user.LastName}`}</div>
        <form action={formAction}>
          <SubmitButton name="Log out" className="mt-4 !w-1/2" />
        </form>
      </div>
    </>
  );
}
