import { getUserDetails } from '../cart/actions';
import UserModal from './modal';

export default async function Login({ className }: { className?: string }) {
  const user = await getUserDetails();

  return <UserModal className={className} user={user} />;
}
