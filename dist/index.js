"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class ZarinpalPayment {
    constructor(_merchant, { isToman = false, isSandbox = false }) {
        this._merchant = _merchant;
        this._baseLinkPayment = "https://payment.zarinpal.com/pg/v4/payment";
        this._sandboxBaseLink = "https://sandbox.zarinpal.com/pg/v4/payment";
        this._gateway = "https://payment.zarinpal.com/pg/StartPay";
        this._sandboxGateway = "https://sandbox.zarinpal.com/pg/StartPay";
        this._baseLinkAPI = "https://api.zarinpal.com/pg/v4/payment";
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
        }
        else {
            this._requestLink = `${this._baseLinkPayment}/request.json`;
            this._verifyLink = `${this._baseLinkPayment}/verify.json`;
        }
    }
    _validateInput(value, name) {
        if (!value) {
            throw new Error(`Zarinpal Pay --> The value *${name}* is invalid!`);
        }
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ amount, description, callback_url, mobile = "No mobile", email = "No email", order_id = "No order ID", }) {
            var _b;
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
                const { data } = yield axios_1.default.post(this._requestLink, transactionInfo);
                if ((_b = data.errors) === null || _b === void 0 ? void 0 : _b.length) {
                    throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
                }
                return {
                    data: Object.assign(Object.assign({}, data.data), { link: `${this._isSandbox ? this._sandboxGateway : this._gateway}/${data.data.authority}` }),
                };
            }
            catch (err) {
                throw new Error(`Zarinpal Pay --> ${err}`);
            }
        });
    }
    verify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ authority, amount }) {
            var _b;
            this._validateInput(amount, "Amount");
            this._validateInput(authority, "Authority");
            try {
                const { data } = yield axios_1.default.post(this._verifyLink, {
                    merchant_id: this._merchant,
                    amount,
                    authority,
                });
                if ((_b = data.errors) === null || _b === void 0 ? void 0 : _b.length) {
                    throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
                }
                return data;
            }
            catch (err) {
                throw new Error(`Zarinpal Pay --> ${err}`);
            }
        });
    }
    inquiry(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { data } = yield axios_1.default.post(`${this._baseLinkAPI}/inquiry.json`, {
                    merchant_id: this._merchant,
                    authority,
                });
                if ((_a = data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                    throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
                }
                return data.data;
            }
            catch (err) {
                throw new Error(`Zarinpal Pay --> ${err}`);
            }
        });
    }
    reverse(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { data } = yield axios_1.default.post(`${this._baseLinkAPI}/reverse.json`, {
                    merchant_id: this._merchant,
                    authority,
                });
                if ((_a = data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                    throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
                }
                return data.data;
            }
            catch (err) {
                throw new Error(`Zarinpal Pay --> ${err}`);
            }
        });
    }
    unverified() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { data } = yield axios_1.default.post(`${this._baseLinkAPI}/unVerified.json`, {
                    merchant_id: this._merchant,
                });
                if ((_a = data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                    throw new Error(`Zarinpal Pay --> ${JSON.stringify(data.errors)}`);
                }
                return data.data;
            }
            catch (err) {
                throw new Error(`Zarinpal Pay --> ${err}`);
            }
        });
    }
}
exports.default = ZarinpalPayment;
