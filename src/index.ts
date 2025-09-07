import axios, { AxiosResponse } from "axios";

interface CreateType {
  amount: number;
  callback_url: string;
  description?: string;
  mobile?: string;
  email?: string;
  order_id?: string;
}

interface VerifyType {
  amount: number;
  authority: string;
}

interface OptionsZarinpal {
  isToman?: boolean;
  isSandbox?: boolean;
}

type Metadata = {
  mobile?: string;
  email?: string;
  order_id?: string;
};

export default class ZarinpalPayment {
  private readonly _baseLinkPayment = "https://payment.zarinpal.com/pg/v4/payment";
  private readonly _sandboxBaseLink = "https://sandbox.zarinpal.com/pg/v4/payment";
  private readonly _gateway = "https://payment.zarinpal.com/pg/StartPay";
  private readonly _sandboxGateway = "https://sandbox.zarinpal.com/pg/StartPay";
  private _requestLink!: string;
  private _verifyLink!: string;
  private _currency: string = "IRR";
  private _isSandbox: boolean = false;

  constructor(private _merchant: string, options: OptionsZarinpal = {}) {
    const { isToman = false, isSandbox = false } = options;
    if (!_merchant || _merchant.length !== 36) {
      throw new Error("Zarinpal Pay --> Merchant ID is invalid!");
    }
    this._isSandbox = isSandbox;
    this._currency = isToman ? "IRT" : "IRR";
    this._setLinks();
  }

  private _setLinks = () => {
    const base = this._isSandbox ? this._sandboxBaseLink : this._baseLinkPayment;
    this._requestLink = `${base}/request.json`;
    this._verifyLink = `${base}/verify.json`;
  };

  private _validateInput = (value: any, name: string) => {
    if (value === undefined || value === null || value === "") {
      throw new Error(`Zarinpal Pay --> The value *${name}* is invalid!`);
    }
  };

  private async _post(url: string, payload: any) {
    try {
      const { data } = await axios.post(url, payload);
      if (data.errors?.length) {
        throw new Error(JSON.stringify(data.errors));
      }
      return data.data ?? data;
    } catch (err: any) {
      throw err?.response?.data?.errors;;
    }
  }

  async create({
    amount,
    callback_url,
    description = "",
    mobile,
    email,
    order_id,
  }: CreateType) {
    this._validateInput(amount, "Amount");
    this._validateInput(callback_url, "Callback URL");
    this._validateInput(description, "Description");

    const transactionInfo = {
      merchant_id: this._merchant,
      amount,
      currency: this._currency,
      description,
      callback_url,
      metadata: [mobile, email, order_id],
      order_id,
    };

    const data = await this._post(this._requestLink, transactionInfo);
    return {
      ...data,
      link: `${this._isSandbox ? this._sandboxGateway : this._gateway}/${data.authority}`,
    };
  }

  async verify({ authority, amount }: VerifyType) {
    this._validateInput(authority, "Authority");
    this._validateInput(amount, "Amount");

    return this._post(this._verifyLink, {
      merchant_id: this._merchant,
      authority,
      amount,
    });
  }

  async inquiry(authority: string) {
    this._validateInput(authority, "Authority");
    return this._post(`${this._baseLinkPayment}/inquiry.json`, {
      merchant_id: this._merchant,
      authority,
    });
  }

  async reverse(authority: string) {
    this._validateInput(authority, "Authority");
    return this._post(`${this._baseLinkPayment}/reverse.json`, {
      merchant_id: this._merchant,
      authority,
    });
  }

  async unverified() {
    return this._post(`${this._baseLinkPayment}/unVerified.json`, {
      merchant_id: this._merchant,
    });
  }
}