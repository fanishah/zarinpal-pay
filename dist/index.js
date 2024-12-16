"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class ZarinpalPayment {
  constructor(_merchant, { isToman = false, isSandbox = false }) {
    this._merchant = _merchant;
    this._baseLink = "https://payment.zarinpal.com/pg/v4/payment";
    this._sandboxBaseLink = "https://sandbox.zarinpal.com/pg/v4/payment";
    this._gateway = "https://payment.zarinpal.com/pg/StartPay";
    this._sandboxGateway = "https://sandbox.zarinpal.com/pg/StartPay";
    this._unVerifiedLink =
      "https://api.zarinpal.com/pg/v4/payment/unVerified.json";
    this._currency = "IRR";
    this._isSandbox = false;
    if (!_merchant || _merchant.length !== 36) {
      throw new Error("Zarinpal Pay --> Merchant ID is invalid!");
    }
    this._setLinks(isSandbox);
    this._isSandbox = isSandbox;
    if (isToman) {
      this._currency = "IRT";
    }
  }
  _setLinks(isSandbox) {
    if (isSandbox) {
      this._requestLink = `${this._sandboxBaseLink}/request.json`;
      this._verifyLink = `${this._sandboxBaseLink}/verify.json`;
    } else {
      this._requestLink = `${this._baseLink}/request.json`;
      this._verifyLink = `${this._baseLink}/verify.json`;
    }
  }
  _validateInput(value, name) {
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
  }) {
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
      const { data } = await axios_1.default.post(
        this._requestLink,
        transactionInfo
      );
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
    } catch (err) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }
  async verify({ authority, amount }) {
    this._validateInput(amount, "Amount");
    this._validateInput(authority, "Authority");
    try {
      const { data } = await axios_1.default.post(this._verifyLink, {
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
  async unverified() {
    try {
      const { data } = await axios_1.default.post(this._unVerifiedLink, {
        merchant_id: this._merchant,
      });
      if (data.errors?.length) {
        throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
      }
      return data.data;
    } catch (err) {
      throw new Error(`Zarinpal Pay --> ${err}`);
    }
  }
}
module.exports = ZarinpalPayment;
