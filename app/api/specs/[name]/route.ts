import { getToken } from '../../../../components/cart/actions';
import { getSpecs } from '../../../../lib/order-cloud';

// export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: { name: string } }) {
  if (!params.name) return Response.json({});
  const data = await getSpecs(params.name, await getToken(true));
  return await Response.json(data);
}
