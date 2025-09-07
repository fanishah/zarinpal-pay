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
    private readonly _baseLinkPayment;
    private readonly _sandboxBaseLink;
    private readonly _gateway;
    private readonly _sandboxGateway;
    private _requestLink;
    private _verifyLink;
    private _currency;
    private _isSandbox;
    constructor(_merchant: string, options?: OptionsZarinpal);
    private _setLinks;
    private _validateInput;
    private _post;
    create({ amount, callback_url, description, mobile, email, order_id, }: CreateType): Promise<any>;
    verify({ authority, amount }: VerifyType): Promise<any>;
    inquiry(authority: string): Promise<any>;
    reverse(authority: string): Promise<any>;
    unverified(): Promise<any>;
}
export {};
