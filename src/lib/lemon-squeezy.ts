const API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
const API_BASE = "https://api.lemonsqueezy.com/v1";

function getKey() {
  if (!API_KEY) throw new Error("LEMON_SQUEEZY_API_KEY not set");
  return API_KEY;
}

function getStore() {
  if (!STORE_ID) throw new Error("LEMON_SQUEEZY_STORE_ID not set");
  return STORE_ID;
}

export async function createCheckoutUrl(
  variantId: string,
  email: string,
  userId: string,
  origin: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            redirect_url: `${origin}/pricing/success`,
          },
          checkout_data: {
            email,
            custom: { user_id: userId },
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: getStore() },
          },
          variant: {
            data: { type: "variants", id: variantId },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("LS checkout error:", res.status, body);
    throw new Error(`Lemon Squeezy error: ${res.status}`);
  }

  const json = await res.json();
  return json.data.attributes.url;
}

export async function getSubscription(subscriptionId: string) {
  const res = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization: `Bearer ${getKey()}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function cancelSubscription(subscriptionId: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: {
          cancelled: true,
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("LS cancel error:", res.status, body);
    return { ok: false, error: `LS API error ${res.status}: ${body}` };
  }

  return { ok: true };
}

export async function getCustomerPortalUrl(customerId: string): Promise<string | null> {
  const res = await fetch(`${API_BASE}/customer-portal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "customer-portals",
        attributes: {
          customer_id: parseInt(customerId, 10),
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("LS portal error:", res.status, body);
    return null;
  }

  const json = await res.json();
  return json.data?.attributes?.url || null;
}
