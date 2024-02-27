import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { cookies } from 'next/headers';

// export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const category = await getCategory(decodeURIComponent(params.collection));

  if (!category) return notFound();

  return {
    title: category.Name,
    description: category.Description || `${category.Name} products`
  };
}

async function getCategory(name: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/category/${name}`, {
      credentials: 'include',
      headers: { Cookie: cookies().toString() }
    });
    return await res.json();
  } catch (error) {
    return undefined;
  }
}

async function getProducts(name: string) {
  const res = await fetch(`http://localhost:3000/api/products/${name}`, {
    credentials: 'include',
    headers: { Cookie: cookies().toString() }
  });
  const data = await res.json();
  return data;
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  //const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });

  const res = await getProducts(decodeURIComponent(params.collection));
  const products = res?.Items;
  if (!products) return <></>;

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
