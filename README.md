<div dir="rtl">
<p align="center">
<img src="https://s2.uupload.ir/files/4534_aeg.png" alt="Logo" height=170>
<h1 align="center">ZarinPal Pay</h1>
با استفاده از این پکیچ می توانید به صورت آسان از درگاه بانکی زرین پال در پروژه های Node.js خود استفاده کنید.
</p>
</div>

<div align="center">
  <br />
  <a href="https://fanishah.ir">fanishah.ir</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/fanishah/zarinpal-pay/issues">Issues</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://npmjs.com/package/eazy-idpay">Eazy-IdPay</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://link.fanishah.ir/zarinpal-pay-exemple">نمونه کد</a>
  <br />
</div>

<div dir="rtl">

# روش نصب

</div>

```
npm i zarinpal-pay
```

<div dir="rtl">

# متد ها

  </div>
  
```
create() // ایجاد تراکنش
verify() // تایید تراکنش
unverified() // ليست پرداخت هاي موفق اخیر
```

  <div dir="rtl">

# احراز هویت درگاه

  </div>
  
```
import  ZarinpalPayment from  "zarinpal-pay";
const zarinpal = new ZarinpalPayment (Merchant, isTomam ,isSandbox);
```
  <div dir="rtl">
  
**پارمتر Merchant**

- كد 36 كاراكتری اختصاصی برای احراز هویت درگاه

**پارمتر isTomam (اختیاری)**

- واحد پولی درگاه که صورت پیشفرض ریال می باشد.
  > مقدار به صورت پیشفرض false می باشد و در صورت true واحد پولی درگاه تومان میشود.

**پارمتر isSandbox (اختیاری)**

- درگاه آزمایشی

  > به صورت پیشفرض false می باشد در صورت true بودن درگاه به صورت آزمایشی می باشد.
  >
  > برای استفاده از درگاه آزمایشی باید برای قسمت Merchant کد 36 کارکتر دلخواه وارد نمایید

  </div>
  <div dir="rtl">

  # ایجاد تراکنش

  <p>
  برای ایجاد تراکنش از متد create استفاده کنید

  </p>

  </div>

```
try{

	const createpay = await zarinpal.create({
	amount: 100000,
	callback_url: "http://localhost:8080/callback",
	mobile: "09339993377",
	email: "my@site.com",
	description: "توضیحات تراکنش",
	order_id: "3010",
	});

}catch (err) {
	console.log(err);
}
```

  <div dir="rtl">
	
  در صورت درست بودن تمام ورودی های متد پاسخ زیر برای شما به صورت جیسون به شما داده میشود و مقدار code باید 100 باشد
</div>

```
{
    "data":{
        "code": 100,
        "message": "Success",
        "authority": "A00000000000000000000000000217885159",
        "fee_type": "Merchant",
        "fee": 100,
        link:"https://zarinpal.com/pg/StartPay/A00000000000000000000000000217885159"
	},
	"errors": []
}
```

<div dir="rtl">
  
   شما باید برای انجام مراحل پرداخت کاربر را به  پراپرتی link در پاسخ ایجاد تراکنش ریدایرکت کنید

در صورت بروز خطا در ایجاد تراکنش پاسخی مشابه زیر به صورت جیسون دریافت می کنید

</div>

```
{
  code: -9,
  message: 'The input params invalid, validation error.',
  validations: [ { amount: 'The amount must be at least 1000.' } ]
}
```

[ لیست خطاها](https://www.zarinpal.com/docs/paymentGateway/errorList.html)

| اجباری | نوع مقدار | توضیحات                            | ورودی        |
| ------ | --------- | ---------------------------------- | ------------ |
| بله    | عدد       | مبلغ تراكنش                        | amount       |
| بله    | رشته      | صفحه بازگشت پس از انجام عمل پرداخت | callback_url |
| خیر    | رشته      | شماره تماس خریدار                  | mobile       |
| خیر    | رشته      | ایمیل خریدار                       | email        |
| خیر    | رشته      | توضیحات مربوط به تراکنش            | description  |
| خیر    | رشته      | شماره سفارش                        | order_id     |

<div dir="rtl">

# تایید تراکنش

در صفحه کال بک می توانید مرحله اعتبار سنجی تراکنش را با متد verify انجام دهید.

</div>

```
try{

  const verifypay = await zarinpal.verify({authority , amount});

}catch (err) {

	console.log(err);

}
```

<div dir="rtl">
  
بعد از پايان عمليات درسمت زرينپال، زرينپال وظيفه دارد كاربر را به سايت پذيرنده كه از طريق callback_url مشخص شده است بازگرداند.
 
این مرحله زمانی انجام میشه که کاربر از درگاه پرداخت بر میگرده. در این مرحله با توجه به نتیجه تراکنش و وضعیت اون ، ما کاربر رو به آدرس کالبک شما که در ارسال اطلاعات با پارامتر  `callback_url`  ارسال کرده بودید هدایت میکنیم.

نكته: توجه داشته باشيد كه يك `Status` به صورت `QueryString` به سايت پذيرنده ارسال ميگردد كه دو مقدار ثابت دارد ”OK“ و”NOK“ ؛ در صورتي كه اين مقدار برابر ”NOK“ بود به اين معنا بوده كه تراكنش نا موفق بوده و يا توسط كاربر لغو شده است؛ پس در صورتي verify استفاده شود كه با QueryString مقدار Status برابر با ”OK“ باشد.

</div>
<p align="center" style="color:green">مثال تراکنش موفق</p>

`http://www.yoursite.ir/Authority=A00000000000000000202690354&Status=OK`

<p align="center" style="color:red">
مثال تراکنش ناموفق
</p>

`http://www.yoursite.ir/Authority=A00000000000000000202690354&Status=NOK`

| اجباری | نوع  | ورودی     |
| ------ | ---- | --------- |
| بله    | عدد  | amount    |
| بله    | رشته | authority |

<div dir="rtl">
در صفحه بازگشت می بایست با متد verify اطلاعات ارسالی را چک نمایید و در صورت موفق بودن پرداخت را ثبت و شماره تراکنش را به کاربر نمایش دهید

در غير اينصورت پذيرنده موظف اسـت كـه بـا توجه به كد خطايي كه توسط متد verify دريافت ميكند كاربر را از خطاي رخ داده مطلع سازد.

در این مرحله اگر مقدار پارامتر code برابر 100 بود به معنای موفق بودن تراکنش است و با پارامتر ref_id شماره تراکنش را به کاربر نمایش میدهید

در صورتی که کاربر تراکنش را پرداخت کرده باشد پاسخ متد verify مشابه زیر است توجه کنید باید مقدار code عدد 100 باشد

  </div>

```
{
    "data": {
        "code": 100,
        "message": "Verified",
        "card_hash": "1EBE3EBEBE35C7EC0F8D6EE4F2F859107A87822CA179BC9528767EA7B5489B69",
        "card_pan": "502229******5995",
        "ref_id": 201,
        "fee_type": "Merchant",
        "fee": 0
    },
    "errors": []
}
```

<div dir="rtl">
** مهم : ** 
درصورت موفقیت آمیز بودن تراکنش، با فراخوانی متد verify، یکبار کد مقدار code  برابر با 100 می باشد و در دفعات بعدی وریفای همان تراکنش مقدار code  برابر با 101 می باشد.
 </div>
<div dir="rtl">

کد code 101 به معنای آن است که تراکنش موفق بوده و یکبار قبلا وریفای شده است و این بار دوم هست

 </div>

 <div dir="rtl">

# متد unverified

ممكن است شما نياز داشته باشيد كه متوجه شويد چه پرداخت هاي توسط وب سرويس شما به درستي انجام شده اما متد verify روي آنها اعمال نشده ، به عبارت ديگر اين متد ليست پرداخت هاي موفقي كه شما آنها را تصديق نكرده ايد را به شما نمايش مي دهد.

</div>
<p align="right">

نمونه اطلاعات بازگشتی :

</p>

```
{
    "data": {
        "code": "100",
        "message": "Success",
        "authorities": [
            {
                "authority": "A00000000000000000000000000207288780",
                "amount": 50500,
                "callback_url": "https://golroz.com/vpay",
                "referer": "https://golroz.com/test-form/",
                "date": "2020-07-01 17:33:25"
            },
            {
                "authority": "A00000000000000000000000000207296503",
                "amount": 50500,
                "callback_url": "https://golroz.com/vpay",
                "referer": "https://golroz.com/test-form/",
                "date": "2020-07-01 18:58:32"
            },
            {
                "authority": "A00000000000000000000000000206873220",
                "amount": 11100,
                "callback_url": "zarin_link",
                "referer": "/",
                "date": "2020-06-27 10:22:02"
            }
        ]
    }
}
```
