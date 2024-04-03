import { getToken } from '../../../../components/cart/actions';
import { getProducts } from '../../../../lib/order-cloud';

// export const runtime = 'edge';
export async function GET(req: Request, { params }: { params: { query: string } }) {
  if (!params.query) return Response.json({});
  const data = await getProducts({ query: params.query }, await getToken(true));
  return await Response.json(data);
}
