import axios, { AxiosResponse } from "axios";
import fetch, { Response } from "node-fetch";

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

interface PayPalAccessTokenResponse {
  access_token: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
}

export const createOrder = async (): Promise<PayPalOrderResponse> => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;

  const response: AxiosResponse = await axios.post(
    url,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return handleResponse(response);
};

export const capturePayment = async (orderId: string): Promise<PayPalOrderResponse> => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;

  const response: AxiosResponse = await axios.post(url, null, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

const generateAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");
  const response: Response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData: PayPalAccessTokenResponse = await handleResponse(response);
  return jsonData.access_token;
};

const handleResponse = async <T>(response: AxiosResponse | Response): Promise<T> => {
  if ("status" in response && (response.status === 200 || response.status === 201)) {
    if ("data" in response) {
      return response.data as T; // Axios response
    } else {
      return (await response.json()) as T; // Fetch response
    }
  }

  const errorMessage = "data" in response ? response.data : await response.text();
  throw new Error(errorMessage);
};

export default {
  createOrder,
  capturePayment,
};