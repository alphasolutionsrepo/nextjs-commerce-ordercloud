import { getToken } from 'components/cart/actions';
import { getProducts } from 'lib/order-cloud';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

//export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { query: string } }) {
  if (!params.query) return Response.json({});
  console.log(cookies().has('token'));
  const data = await getProducts({ query: params.query }, await getToken(true));
  return await Response.json(data);
}
