import {
  AccessToken,
  Address,
  ApiRole,
  Auth,
  Configuration,
  LineItem,
  LineItems,
  Me,
  MeUser,
  Order,
  Orders,
  Payment,
  Payments,
  Tokens,
  VariantSpec
} from 'ordercloud-javascript-sdk';
import fetchAdapter from './fetch-adapter';
import { Menu } from './types';

const username = 'YOUR_USERNAME'; //username of the user logging in
const password = 'YOUR_PASSWORD'; //password of the user logging in
const clientID = '311D3A03-B94F-460C-9B24-2BCEB54CC138'; //anonymous
const scope: ApiRole[] = [
  'ProductReader',
  'CategoryReader',
  'MeAddressAdmin',
  'MeCreditCardAdmin',
  'Shopper'
]; //string array of [roles](https://ordercloud.io/knowledge-base/security-profiles) the application has access to

Configuration.Set({
  baseApiUrl: 'https://sandboxapi.ordercloud.io',
  timeoutInMilliseconds: 20 * 1000,
  axiosAdapter: fetchAdapter
});

export async function auth(token?: string): Promise<string | undefined> {
  try {
    if (!token) {
      const authResponse = await Auth.Anonymous(clientID, scope);
      Tokens.SetAccessToken(authResponse.access_token);
      return authResponse.access_token;
    } else {
      Tokens.SetAccessToken(token);
      return token;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getCategories(depth: number, token: string) {
  try {
    if (depth < 1) return undefined;
    await auth(token);
    const categories = await Me.ListCategories({ depth: depth.toString() });
    return categories;
  } catch (err) {
    console.error(err);
  }
}

export async function getCategoryProducts(
  { categoryId, categoryName }: { categoryId?: string; categoryName?: string },
  token: string
) {
  try {
    await auth(token);
    let products;
    if (categoryId) products = await Me.ListProducts({ categoryID: categoryId });
    else if (categoryName) {
      await auth(token);
      const category = await getCategory({ name: categoryName }, token);
      if (category) {
        await auth(token);
        products = await Me.ListProducts({ categoryID: category.ID });
      }
    }
    return products;
  } catch (err) {
    console.error(err);
  }
}

export async function getCategory({ id, name }: { id?: string; name?: string }, token: string) {
  try {
    await auth(token);
    let category;
    if (id) category = await Me.GetCategory(id);
    else if (name) {
      const categories = await Me.ListCategories({ search: name, searchOn: ['Name'] });
      category = categories.Items?.at(0);
    }

    return category;
  } catch (err) {
    console.error(err);
  }
}

export async function getProduct(handle: string, token: string) {
  try {
    await auth(token);
    const product = await Me.GetProduct(handle);
    return product;
  } catch (err) {
    console.error(err);
  }
}

export async function getVariants(productId: string, token: string) {
  try {
    if (!productId) return [];
    await auth(token);
    const variants = await Me.ListVariants(productId);
    return variants?.Items;
  } catch (err) {}
}

export async function getSpecs(productId: string, token: string) {
  try {
    if (!productId) return [];
    await auth(token);
    const specs = await Me.ListSpecs(productId);
    return specs?.Items;
  } catch (err) {}
}

export async function getProducts({ query }: { query?: string }, token: string) {
  try {
    await auth(token);
    let products;
    if (query) products = await Me.ListProducts({ search: query });
    else products = await Me.ListProducts();
    return products;
  } catch (err) {
    console.error(err);
  }
}

export async function getMenu(handle: string, token: string): Promise<Menu[]> {
  if (handle == 'header-menu') {
    const categories = await getCategories(1, token);
    return (
      categories?.Items.map((category) => ({
        title: category.Name,
        path: `/search/${category.Name}`
      })) ?? []
    );
  }
  const menu = [
    { title: 'OrderCloud', path: 'https://ordercloud.io/' },
    { title: 'Contact us', path: 'https://www.sitecore.com/company/contact-us' }
  ];
  return menu;
}

export async function getProductRecommendations(handle: string, categoryID: string, token: string) {
  // await auth();
  // const products = await Products.List({categoryID: categoryID});
  // if(products) {
  //     const scheduleIds = products.Items.map((product) => (product.DefaultPriceScheduleID));
  //     const schedules = await PriceSchedules.List()
  // }
  // return products;
  return undefined;
}

export async function getCollectionProducts(token: string) {
  try {
    await auth(token);

    const products = await Me.ListProducts();
    return products;
  } catch (err) {
    console.error(err);
  }
}

export interface OrderDetails {
  order: Order;
  lines?: LineItem[];
}

export async function getCart(cartId: string, token: string): Promise<OrderDetails | undefined> {
  try {
    await auth(token);
    let cart;
    if (cartId) {
      cart = await Orders.Get('Outgoing', cartId);
    } else {
      return undefined;
    }
    if (cart?.ID) {
      await auth(token);
      const lines = await LineItems.List('Outgoing', cartId);
      return { order: cart, lines: lines.Items };
    }
    return { order: cart };
  } catch (err) {
    console.error(err);
  }
}

export async function createCart(token: string): Promise<OrderDetails> {
  await auth(token);
  const cart = await Orders.Create('Outgoing', {});
  return { order: cart };
}

export async function addToCart(
  cartId: string,
  productId: string,
  specs: VariantSpec[] | undefined,
  quantity: number,
  lineId: string | undefined,
  token: string
): Promise<void> {
  await auth(token);
  let addLineItem: LineItem = { ProductID: productId, Quantity: quantity, ID: lineId };
  if (specs) {
    addLineItem.Specs = specs.map((spec) => ({ OptionID: spec.OptionID, SpecID: spec.SpecID }));
  }

  if (addLineItem.ID) {
    await LineItems.Patch('Outgoing', cartId, addLineItem.ID, addLineItem);
  } else {
    const lineItem = await LineItems.Create('Outgoing', cartId, addLineItem);
  }
}

export async function removeFromCart(cartId: string, lineId: string, token: string): Promise<void> {
  await auth(token);
  await LineItems.Delete('Outgoing', cartId, lineId);
}

export async function updateCart(
  cartId: string,
  line: { id: string; merchandiseId: string; quantity: number },
  token: string
): Promise<void> {
  await auth(token);
  const updatedLine = await LineItems.Patch('Outgoing', cartId, line.id, {
    ProductID: line.merchandiseId,
    Quantity: line.quantity
  });
}

export async function upsertBillingAddress(cartId: string, address: Address, token: string) {
  await auth(token);
  const order = await Orders.SetBillingAddress('Outgoing', cartId, address);
}

export async function upsertShippingAddress(cartId: string, address: Address, token: string) {
  await auth(token);
  const order = await Orders.SetShippingAddress('Outgoing', cartId, address);
}

export async function submitOrder(cartId: string, token: string): Promise<Order> {
  await auth(token);
  const order = await Orders.Submit('Outgoing', cartId);
  return order;
}

export async function addPayment(cartId: string, token: string): Promise<Payment> {
  await auth(token);
  const payment = await Payments.Create('Outgoing', cartId, { Type: 'PurchaseOrder' });
  return payment;
}

export async function logInUser(
  username: string,
  password: string
): Promise<AccessToken | undefined> {
  try {
    const token = await Auth.Login(username, password, clientID);
    return token;
  } catch (error) {
    console.error(error);
  }
}

export async function logOutUser(token: string) {
  await auth(token);
  await Tokens.RemoveAccessToken();
  return await auth();
}

export async function getUser(token: string): Promise<MeUser | undefined> {
  try {
    await auth(token);
    const user = await Me.Get();
    return user;
  } catch (err) {
    console.error(err);
  }
}
