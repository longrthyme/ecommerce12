const config = {
    vnp_TmnCode: "2SQRBKLC",
    vnp_HashSecret: "OU0TM2P6QQWB7JBVP0OYQP3PY7T3QRHK",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "http://yourdomain.com/vnpay-return",
};

exports.getVNPayConfig = (orderId: string , returnUrl: string) => {
    return {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: config.vnp_TmnCode,
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderType: "other",
        vnp_Locale: "vn",
        vnp_ReturnUrl: returnUrl,
    };
};

exports.getSecretKey = () => config.vnp_HashSecret;
exports.getVnpPayUrl = () => config.vnp_Url;
exports.getVnpPayReturnUrl = () => config.vnp_ReturnUrl;
