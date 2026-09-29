export const ViberProviderCode = ['Promotexter', 'PromotexterApix', 'Infobip'] as const;
export type ViberProviderCode = (typeof ViberProviderCode)[number];

export interface ViberProvider {
  code: ViberProviderCode;
  name: string;
  urls: string[];
}
