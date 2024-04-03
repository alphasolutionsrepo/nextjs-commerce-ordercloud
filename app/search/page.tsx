import { cookies } from 'next/headers';
import Grid from '../../components/grid';
import ProductGridItems from '../../components/layout/product-grid-items';
import { defaultSort, sorting } from '../../lib/constants';

// export const runtime = 'edge';
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

async function getProducts(query: string | undefined) {
  const res = await fetch(`${baseUrl}/api/search/${query}`, {
    credentials: 'include',
    headers: { Cookie: cookies().toString() }
  });
  const data = await res.json();
  return data;
}

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  //const products = (await getProducts({ sortKey, reverse, query: searchValue })).Items;
  const products = (await getProducts(searchValue))?.Items ?? [];

  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
