import { getToken } from '../../../../components/cart/actions';
import { getCategoryProducts } from '../../../../lib/order-cloud';

// export const runtime = 'edge';
export async function GET(req: Request, { params }: { params: { name: string } }) {
  if (!params.name) return Response.json({});
  const data = await getCategoryProducts({ categoryName: params.name }, await getToken(true));
  return await Response.json(data);
}
