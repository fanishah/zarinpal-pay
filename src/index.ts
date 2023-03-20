import axios from "axios";

interface CreateType {
  amount: number;
  callback_url: string;
  description?: string;
  mobile?: string;
  email?: string;
}
interface VerifyType {
  amount: number;
  authority: string;
}

class zarinpal_payment {
  private _requestLink: string =
    "https://api.zarinpal.com/pg/v4/payment/request.json";
  private _verifyLink: string =
    "https://api.zarinpal.com/pg/v4/payment/verify.json";

  private _unVerifiedLink: string =
    "https://api.zarinpal.com/pg/v4/payment/unVerified.json";
  private _gateway: string = "https://www.zarinpal.com/pg/StartPay";
  private _currency: string = "IRR";

  constructor(
    private _merchant: string,
    private _isToman: boolean = false,
    private _isSandbox: boolean = false
  ) {
    if (!_merchant || _merchant.length > 36 || _merchant.length < 36) {
      throw Error("Merchant ID is invalid!");
    }
    if (this._isSandbox) {
      this._requestLink =
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
      this._verifyLink =
        "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
      this._gateway = "https://sandbox.zarinpal.com/pg/StartPay";
    }
    if (_isToman) {
      this._currency = "IRT";
    }
  }

  async create({
    amount,
    description,
    callback_url,
    mobile,
    email,
  }: CreateType) {
    if (!amount) {
      throw Error("The value *Amount* is invalid!");
    }
    if (!description) {
      throw Error("The value *Description* is invalid!");
    }
    if (!callback_url) {
      throw Error("The value *Callback URL* is invalid!");
    }
    try {
      const { data } = await axios.post(this._requestLink, {
        merchant_id: this._merchant,
        amount,
        currency: this._currency,
        description,
        callback_url,
        metadata: [mobile, email],
      });
      if (data.errors) {
        return data.errors
      }
      return {
        data: {
          ...data.data,
          link: `${this._gateway}/${data.data.authority}`,
        },
        errors: data.errors,
      };
    } catch (err:any) {
      console.log(err);
      console.log("============= Error =============");
    }
  }
  async verify({ authority, amount }: VerifyType) {
    if (!amount) {
      throw Error("The value *Amount* is invalid!");
    }
    if (!authority) {
      throw Error("The value *Authority* is invalid!");
    }
    try {
      const { data } = await axios.post(this._verifyLink, {
        merchant_id: this._merchant,
        amount,
        authority,
      });
      return data;
    } catch (err) {
      console.log(err);
      console.log("============= err =============");
    }
  }
  async unverified() {
    try {
      const { data } = await axios.post(this._unVerifiedLink, {
        merchant_id: this._merchant,
      });
      return data;
    } catch (err) {
      console.log(err);
      console.log("============= err =============");
    }
  }
}

export default zarinpal_payment;

const ss = new zarinpal_payment("5c2aca12-5b06-11e9-a7f1-000c295eb8fc")
  .create({
    amount: 20,
    callback_url: "sss",
    description: "s",
  })
  .then((ww) => {
    console.log(ww);
  })
  .catch((err) => {
    console.log(err);
    console.log("========err=========");
  });
  