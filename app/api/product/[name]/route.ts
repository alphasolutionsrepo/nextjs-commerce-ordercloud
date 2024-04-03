import { getToken } from '../../../../components/cart/actions';
import { getProduct } from '../../../../lib/order-cloud';

//export const runtime = 'edge';
export async function GET(req: Request, { params }: { params: { name: string } }) {
  if (!params.name) return Response.json({});
  const data = await getProduct(params.name, await getToken(true));
  return await Response.json(data);
}
