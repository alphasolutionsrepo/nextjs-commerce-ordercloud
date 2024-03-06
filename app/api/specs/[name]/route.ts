import { getToken } from 'components/cart/actions';
import { getSpecs } from 'lib/order-cloud';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

//export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  if (!params.name) return Response.json({});
  console.log(cookies().has('token'));
  const data = await getSpecs(params.name, await getToken(true));
  return await Response.json(data);
}
