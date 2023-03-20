type CreateType = {
  amount: number;
  description: string;
  callback_url: string;
  mobile?: string;
  email?: string;
};
type VerifyType = {
  amount: number;
  authority: string;
};

export { CreateType, VerifyType };
