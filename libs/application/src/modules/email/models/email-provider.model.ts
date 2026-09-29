export const EmailProviderCode = ['Aws', 'Aliyun', 'Mailgun', 'Mailjet'] as const;
export type EmailProviderCode = (typeof EmailProviderCode)[number];

export interface EmailProvider {
  code: EmailProviderCode;
  name: string;
  urls: string[];
}
