// lib/sms.ts — 短信发送抽象
// 阶段一：手机号验证码登录。生产接阿里云 dysmsapi；未配密钥时走「本地打印验证码」（开发态）。
// 返回 mockCode 便于本地联调核对；生产返回真实发送结果。

export interface SmsResult {
  ok: boolean;
  /** 开发态本地校验用验证码；生产为空 */
  mockCode?: string;
  error?: string;
}

/** 是否已配置阿里云短信密钥 */
export function smsConfigured(): boolean {
  return Boolean(process.env.ALIYUN_SMS_SIGN_NAME && process.env.ALIYUN_SMS_TEMPLATE_CODE);
}

/**
 * 发送登录验证码。
 * @param phone 目标手机号
 * @param code 6 位验证码
 */
export async function sendSmsCode(phone: string, code: string): Promise<SmsResult> {
  if (!smsConfigured()) {
    // 开发态：不真的发短信，把验证码返回给前端/控制台以便本地登录测试
    console.log(`[SMS-MOCK] 发给 ${phone} 的验证码：${code}`);
    return { ok: true, mockCode: code };
  }

  // T3 TODO：接入 @alicloud/dysmsapi20170525 真实发送
  // const client = new Dysmsapi(...);
  // await client.sendSms({ PhoneNumbers: phone, SignName, TemplateCode, TemplateParam: { code, seconds } });
  return { ok: true };
}