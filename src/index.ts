import axios from "axios";

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

export default class ZarinpalPayment {
  private readonly _baseLinkPayment =
    "https://payment.zarinpal.com/pg/v4/payment";
  private readonly _sandboxBaseLink =
    "https://sandbox.zarinpal.com/pg/v4/payment";
  private readonly _gateway = "https://payment.zarinpal.com/pg/StartPay";
  private readonly _sandboxGateway = "https://sandbox.zarinpal.com/pg/StartPay";
  private readonly _baseLinkAPI = "https://api.zarinpal.com/pg/v4/payment";
  private _requestLink!: string;
  private _verifyLink!: string;
  private _currency: string = "IRR";
  private _isSandbox: boolean = false;

  constructor(
    private _merchant: string,
    { isToman = false, isSandbox = false }: OptionsZarinpal
  ) {
    if (!_merchant || _merchant.length !== 36) {
      throw new Error("Zarinpal Pay --> Merchant ID is invalid!");
    }
    this._setLinks(isSandbox);
    this._isSandbox = isSandbox;
    if (isToman) {
      this._currency = "IRT";
    }
  }

  private _setLinks(isSandbox: boolean) {
    if (isSandbox) {
      this._requestLink = `${this._sandboxBaseLink}/request.json`;
      this._verifyLink = `${this._sandboxBaseLink}/verify.json`;
    } else {
      this._requestLink = `${this._baseLinkPayment}/request.json`;
      this._verifyLink = `${this._baseLinkPayment}/verify.json`;
    }
  }
  private _validateInput(
    value: string | number | undefined,
    name: string
  ): void {
    if (!value) {
      throw new Error(`Zarinpal Pay --> The value *${name}* is invalid!`);
    }
  }

  async create({
    amount,
    description,
    callback_url,
    mobile = "No mobile",
    email = "No email",
    order_id = "No order ID",
  }: CreateType) {
    try {
      this._validateInput(amount, "Amount");
      this._validateInput(description, "Description");
      this._validateInput(callback_url, "Callback URL");

      const transactionInfo = {
        merchant_id: this._merchant,
        amount,
        currency: this._currency,
        description,
        callback_url,
        metadata: [mobile, email, order_id],
        order_id,
      };

      const { data } = await axios.post(this._requestLink, transactionInfo);

      if (data.errors?.length) {
        throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
      }

      return {
        data: {
          ...data.data,
          link: `${this._isSandbox ? this._sandboxGateway : this._gateway}/${
            data.data.authority
          }`,
        },
      };
    } catch (err: any) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }
  async verify({ authority, amount }: VerifyType) {
    this._validateInput(amount, "Amount");
    this._validateInput(authority, "Authority");
    try {
      const { data } = await axios.post(this._verifyLink, {
        merchant_id: this._merchant,
        amount,
        authority,
      });
      if (data.errors?.length) {
        throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
      }
      return data;
    } catch (err) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }
  async inquiry(authority: string) {
    try {
      const { data } = await axios.post(`${this._baseLinkAPI}/inquiry.json`, {
        merchant_id: this._merchant,
        authority,
      });
      if (data.errors?.length) {
        throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
      }
      return data.data;
    } catch (err) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }

  async reverse(authority: string) {
    try {
      const { data } = await axios.post(`${this._baseLinkAPI}/reverse.json`, {
        merchant_id: this._merchant,
        authority,
      });
      if (data.errors?.length) {
        throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
      }
      return data.data;
    } catch (err) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }
  async unverified() {
    try {
      const { data } = await axios.post(
        `${this._baseLinkAPI}/unVerified.json`,
        {
          merchant_id: this._merchant,
        }
      );
      if (data.errors?.length) {
        throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
      }
      return data.data;
    } catch (err) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }
}
