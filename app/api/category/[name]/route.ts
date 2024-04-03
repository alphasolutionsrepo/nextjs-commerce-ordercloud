import { getToken } from '../../../../components/cart/actions';
import { getCategory } from '../../../../lib/order-cloud';

// export const runtime = 'edge';
export async function GET(request: Request, { params }: { params: { name: string } }) {
  if (params?.name) return Response.json({});
  const data = await getCategory({ name: params?.name }, await getToken());
  return Response.json(data);
}
