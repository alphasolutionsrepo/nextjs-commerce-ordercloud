'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Address, VariantSpec } from 'ordercloud-javascript-sdk';
import { TAGS } from '../../lib/constants';
import {
  addPayment,
  addToCart,
  auth,
  createCart,
  getCart,
  getCategories,
  getCategoryProducts,
  getMenu,
  getUser,
  logInUser,
  logOutUser,
  removeFromCart,
  submitOrder,
  updateCart,
  upsertBillingAddress,
  upsertShippingAddress
} from '../../lib/order-cloud';

export async function getToken(skip?: boolean) {
  let token = cookies().get('token')?.value;
  if (token) return token;
  token = await auth();
  if (!skip && token) cookies().set('token', token);
  return token as string;
}

export async function getDetails() {
  let cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId, await getToken(true));
    return cart;
  }
  return undefined;
}

// should be upsert instead
export async function addItem(
  prevState: any,
  payload: {
    productId: string | undefined;
    variantSpecs: VariantSpec[] | undefined;
  }
) {
  let cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId, await getToken());
  }

  if (!cartId || !cart) {
    cart = await createCart(await getToken());
    cartId = cart.order.ID;
    if (cartId) cookies().set('cartId', cartId);
  }

  if (!payload.productId) {
    return 'Missing product variant ID';
  }

  try {
    if (cartId) {
      let line = cart?.lines?.find(
        (line) =>
          line.ProductID === payload.productId &&
          line.Specs?.findIndex(
            (spec) =>
              payload.variantSpecs?.findIndex(
                (variantSpec) =>
                  spec.OptionID === variantSpec.OptionID && spec.SpecID === variantSpec.SpecID
              ) === -1
          ) === -1
      );
      const quantity = line ? (line.Quantity ?? 0) + 1 : 1;
      await addToCart(
        cartId,
        payload.productId,
        payload.variantSpecs,
        quantity,
        line?.ID,
        await getToken()
      );
    }
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart(cartId, lineId, await getToken());
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, lineId, await getToken());
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart(
      cartId,
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      },
      await getToken()
    );
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}

export async function addAddresses(prevState: any, formData: FormData) {
  const cartId = cookies().get('cartId')?.value;
  if (!cartId) {
    return 'Missing cart ID';
  }

  const billingAddress: Address = {
    FirstName: formData.get('billing-first-name') as string,
    LastName: formData.get('billing-last-name') as string,
    Street1: formData.get('billing-street-1') as string,
    Street2: formData.get('billing-street-2') as string,
    City: formData.get('billing-city') as string,
    State: formData.get('billing-state') as string,
    Country: formData.get('billing-country') as string,
    Zip: formData.get('billing-zip') as string,
    Phone: formData.get('billing-phone') as string
  };

  const same = formData.get('same-addresses') == 'on';

  const shippingAddress: Address = {
    FirstName: formData.get('shipping-first-name') as string,
    LastName: formData.get('shipping-last-name') as string,
    Street1: formData.get('shipping-street-1') as string,
    Street2: formData.get('shipping-street-2') as string,
    City: formData.get('shipping-city') as string,
    State: formData.get('shipping-state') as string,
    Country: formData.get('shipping-country') as string,
    Zip: formData.get('shipping-zip') as string,
    Phone: formData.get('shipping-phone') as string
  };

  await upsertBillingAddress(cartId, billingAddress, await getToken());
  if (!same) await upsertShippingAddress(cartId, shippingAddress, await getToken());

  return 'Error setting billing address';
}

export async function addShippingMethod(prevState: any, formData: FormData) {
  return '';
}

export async function addPaymentMethod(prevState: any, formData: FormData) {
  const cartId = cookies().get('cartId')?.value;
  if (!cartId) {
    return 'Missing cart ID';
  }
  await addPayment(cartId, await getToken());
  return '';
}

export async function confirmOrder(prevState: any, formData: FormData) {
  const cartId = cookies().get('cartId')?.value;
  if (!cartId) {
    return 'Missing cart ID';
  }
  const order = await submitOrder(cartId, await getToken());
  if (order.IsSubmitted) {
    cookies().delete('cartId');
    redirect(`/confirmation?order=${order.ID}`);
  }
  return order.IsSubmitted
    ? 'Order created'
    : 'Failed to place order, please try again or contact customer service';
}

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const token = await logInUser(username, password);
  if (token && token.access_token) {
    cookies().set('token', token.access_token);
  } else return 'Unknown username or password';

  redirect('/');
}

export async function getUserDetails() {
  const user = await getUser(await getToken(true));
  return user;
}

export async function getUserMenu(name: string) {
  const menu = await getMenu(name, await getToken(true));
  return menu;
}

export async function getUserCategories(depth: number) {
  const menu = await getCategories(depth, await getToken(true));
  return menu;
}

export async function logout(prevState: any, formData: FormData) {
  const token = await logOutUser(await getToken());
  if (token) {
    cookies().set('token', token);
  }
  redirect('/');
}

export async function testCats(categoryName: string) {
  const data = await getCategoryProducts({ categoryName: categoryName }, await getToken());
  return data;
}
