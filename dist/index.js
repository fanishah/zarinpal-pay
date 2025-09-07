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
    constructor(_merchant, options = {}) {
        this._merchant = _merchant;
        this._baseLinkPayment = "https://payment.zarinpal.com/pg/v4/payment";
        this._sandboxBaseLink = "https://sandbox.zarinpal.com/pg/v4/payment";
        this._gateway = "https://payment.zarinpal.com/pg/StartPay";
        this._sandboxGateway = "https://sandbox.zarinpal.com/pg/StartPay";
        this._currency = "IRR";
        this._isSandbox = false;
        this._setLinks = () => {
            const base = this._isSandbox ? this._sandboxBaseLink : this._baseLinkPayment;
            this._requestLink = `${base}/request.json`;
            this._verifyLink = `${base}/verify.json`;
        };
        this._validateInput = (value, name) => {
            if (value === undefined || value === null || value === "") {
                throw new Error(`Zarinpal Pay --> The value *${name}* is invalid!`);
            }
        };
        const { isToman = false, isSandbox = false } = options;
        if (!_merchant || _merchant.length !== 36) {
            throw new Error("Zarinpal Pay --> Merchant ID is invalid!");
        }
        this._isSandbox = isSandbox;
        this._currency = isToman ? "IRT" : "IRR";
        this._setLinks();
    }
    _post(url, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { data } = yield axios_1.default.post(url, payload);
                if ((_a = data.errors) === null || _a === void 0 ? void 0 : _a.length) {
                    throw new Error(JSON.stringify(data.errors));
                }
                return (_b = data.data) !== null && _b !== void 0 ? _b : data;
            }
            catch (err) {
                throw (_d = (_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.errors;
                ;
            }
        });
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ amount, callback_url, description = "", mobile, email, order_id, }) {
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
            const data = yield this._post(this._requestLink, transactionInfo);
            return Object.assign(Object.assign({}, data), { link: `${this._isSandbox ? this._sandboxGateway : this._gateway}/${data.authority}` });
        });
    }
    verify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ authority, amount }) {
            this._validateInput(authority, "Authority");
            this._validateInput(amount, "Amount");
            return this._post(this._verifyLink, {
                merchant_id: this._merchant,
                authority,
                amount,
            });
        });
    }
    inquiry(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            this._validateInput(authority, "Authority");
            return this._post(`${this._baseLinkPayment}/inquiry.json`, {
                merchant_id: this._merchant,
                authority,
            });
        });
    }
    reverse(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            this._validateInput(authority, "Authority");
            return this._post(`${this._baseLinkPayment}/reverse.json`, {
                merchant_id: this._merchant,
                authority,
            });
        });
    }
    unverified() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._post(`${this._baseLinkPayment}/unVerified.json`, {
                merchant_id: this._merchant,
            });
        });
    }
}
module.exports = ZarinpalPayment;
