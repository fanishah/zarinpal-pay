import axios from "axios";
import { CreateType, VerifyType } from "./types";

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
    const { data } = await axios.post(this._requestLink, {
      merchant_id: this._merchant,
      amount,
      currency: this._currency,
      description,
      callback_url,
      metadata: [mobile, email],
    });
    return {
      data: {
        ...data.data,
        link: `${this._gateway}/${data.data.authority}`,
      },
      errors: [...data.errors],
    };
  }
  async verify({ authority, amount }: VerifyType) {
    const { data } = await axios.post(this._verifyLink, {
      merchant_id: this._merchant,
      amount,
      authority,
    });
    return data;
  }
  async unverified() {
    const { data } = await axios.post(this._unVerifiedLink, {
      merchant_id: this._merchant,
    });
    return data;
  }
}

export default zarinpal_payment;
