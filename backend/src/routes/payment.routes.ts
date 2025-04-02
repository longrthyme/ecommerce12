import { Request, Response, Router } from "express";
import { addToCart, getCartList } from "../controllers/cart.controller";
import { VnpParams } from "../types/VnpParams";
import moment from "moment";

import crypto from "crypto";
import qs from "qs";

const router = Router();

const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Use production URL when live
const TMN_CODE = process.env.VNP_TMNCODE || "";
const SECRET_KEY = process.env.VNP_HASHSECRET || "";
const RETURN_URL = "http://localhost:3000/payment-success"; // Change to your frontend success page


function sortObject(obj: any) {
  const sorted: { [key: string]: string } = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}


export function formatDateToVnpCreateDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

const createPayment = async (req: Request, res: Response) => {
    try {
      const {  amount, bankCode } = req.body;
  
      let date = new Date();
    const orderId = moment(date).format("DDHHmmss");

    console.log("vlaue " + TMN_CODE + SECRET_KEY);
    
  

    const now = new Date();
      const vnpCreateDate = formatDateToVnpCreateDate(now);

      const gmt7Offset = 7 * 60;
      const localOffset = now.getTimezoneOffset();
      const gmt7Time = new Date(
        now.getTime() + (gmt7Offset + localOffset) * 60 * 1000,
      );

      gmt7Time.setMinutes(gmt7Time.getMinutes() + 15);

      const vnpExpireDate = formatDateToVnpCreateDate(gmt7Time);
  
 
      const vnpIpAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

      let vnp_Params:  Partial<VnpParams> = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = TMN_CODE;
      // vnp_Params['vnp_Merchant'] = ''
      vnp_Params['vnp_Locale'] = 'vn';
      vnp_Params['vnp_CurrCode'] = 'VND';
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = `Thanh toan cho ma GD:`;
      vnp_Params['vnp_Amount'] = 10000 * 100;
      vnp_Params['vnp_ReturnUrl'] = "http://localhost:5000";
      vnp_Params['vnp_IpAddr'] = vnpIpAddr;
      vnp_Params['vnp_CreateDate'] = vnpCreateDate;
      vnp_Params['vnp_OrderType'] = 'other';
      vnp_Params['vnp_ExpireDate'] = vnpExpireDate;

      console.log("value is ", TMN_CODE, SECRET_KEY);
      
  
    //   if (bankCode) {
    //     vnp_Params["vnp_BankCode"] = bankCode;
    //   }
  
      // Sort params alphabetically
      vnp_Params = sortObject(vnp_Params);

      
  
      const signData: string = qs.stringify(vnp_Params);
      const hmac = crypto.createHmac('sha512', SECRET_KEY);
      const signed: string = hmac
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
  
      let paymentUrl = `${VNPAY_URL}?${qs.stringify(vnp_Params)}`;
  
      res.json({ paymentUrl });
    } catch (error) {
      console.error("VNPAY Error:", error);
      res.status(500).json({ message: "Payment error" });
    }
  }
  

router.post("/api/create-payment" , createPayment);



export default router;