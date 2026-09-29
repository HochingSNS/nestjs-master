import { EmailProviderCode } from './email-provider.model';
import type { ExtractStrict } from 'type-fest';

export const TransportMethod = ['Smtp', 'ApiKeySecret'] as const;
export type TransportMethod = (typeof TransportMethod)[number];

type SmtpConfig = {
  type: ExtractStrict<TransportMethod, 'Smtp'>;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
};

type ApiKeyConfig = {
  type: ExtractStrict<TransportMethod, 'ApiKeySecret'>;
  url: string;
  apiKey: string;
  apiSecret: string;
};

/**
 * A list of protocol supported by
 */
export const ProviderTransportMethod = {
  Aliyun: ['Smtp'],
  Aws: ['Smtp'],
  Mailgun: ['Smtp'],
  Mailjet: ['Smtp'],
} as const satisfies Record<EmailProviderCode, TransportMethod[]>;

export interface EmailAccount {
  id: string;
  name: string;
  providerCode: EmailProviderCode;
  config: ApiKeyConfig | SmtpConfig;
  senderAddresses: string[];
  createdAt: Date;
  updatedAt: Date;
}
