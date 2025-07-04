import CryptoJS from "crypto-js";

const secret = "zach_front";

const crypto = {
  // 加密
  encrypt: (data: unknown): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
  },
  // 解密
  decrypt: <T>(data: string): T => {
    return JSON.parse(CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8)) as T;
  },
};

export default crypto;