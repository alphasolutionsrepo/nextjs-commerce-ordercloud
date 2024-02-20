import { getDetails } from './actions';
import CartModal from './modal';

export default async function Cart() {
  const cart = await getDetails();

  return <CartModal cart={cart} />;
}
