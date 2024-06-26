import { getToken } from '../../../components/cart/actions';
import { getCollectionProducts } from '../../../lib/order-cloud';

// export const runtime = 'edge';
export async function GET(request: Request) {
  const data = await getCollectionProducts(await getToken());
  return Response.json(data);
}
