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
    private _merchant;
    private readonly _baseLink;
    private readonly _sandboxBaseLink;
    private readonly _gateway;
    private readonly _sandboxGateway;
    private _unVerifiedLink;
    private _requestLink;
    private _verifyLink;
    private _currency;
    private _isSandbox;
    constructor(_merchant: string, { isToman, isSandbox }: OptionsZarinpal);
    private _setLinks;
    private _validateInput;
    create({ amount, description, callback_url, mobile, email, order_id, }: CreateType): Promise<{
        data: any;
    }>;
    verify({ authority, amount }: VerifyType): Promise<any>;
    unverified(): Promise<any>;
}
export {};
