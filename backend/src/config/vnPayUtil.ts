import crypto from "crypto";
import qs from "qs";
import { Request } from "express";

/**
 * Lấy địa chỉ IP của client từ request
 * @param req - Express Request object
 * @returns Địa chỉ IP của client
 */
export const getIpAddress = (req: Request): string => {
    return (
        (req.headers["x-forwarded-for"] as string) )
};

/**
 * Tạo URL tham số thanh toán từ đối tượng params
 * @param params - Đối tượng chứa các tham số VNPAY
 * @param includeSecureHash - Có bao gồm SecureHash hay không
 * @returns Chuỗi query string đã được sắp xếp
 */
export const getPaymentURL = (params: Record<string, string | number>, includeSecureHash: boolean): string => {
    const sortedParams = Object.fromEntries(Object.entries(params).sort());
    let queryString = qs.stringify(sortedParams, { encode: false });

    return includeSecureHash ? queryString : queryString.replace(/&vnp_SecureHash=[^&]*/, "");
};

/**
 * Tạo chữ ký bảo mật HMAC SHA512
 * @param secretKey - Khóa bí mật của VNPAY
 * @param data - Dữ liệu cần ký
 * @returns Giá trị HMAC SHA512 đã mã hóa
 */
export const hmacSHA512 = (secretKey: string, data: string): string => {
    return crypto.createHmac("sha512", Buffer.from(secretKey, "utf-8"))
                 .update(Buffer.from(data, "utf-8"))
                 .digest("hex");
};
