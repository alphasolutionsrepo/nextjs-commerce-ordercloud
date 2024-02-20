import { getToken } from 'components/cart/actions';
import { getCategoryProducts } from 'lib/order-cloud';
import { NextRequest } from 'next/server';

//export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  if (!params.name) return Response.json({});
  const data = await getCategoryProducts({ categoryName: params.name }, await getToken());
  return await Response.json(data);
}
