import { getToken } from 'components/cart/actions';
import { getCategory } from 'lib/order-cloud';
import { NextRequest } from 'next/server';

//export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  if (!params.name) return Response.json({});
  const data = await getCategory({ name: params.name }, await getToken());
  return Response.json(data);
}
