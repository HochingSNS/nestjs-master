import { ViberOtp, SendViberResult, ViberTemplateMessage } from '../models/viber-message.model';

export interface ViberSender {
  /**
   * Send approved OTP message
   * Usage: OTP message
   */
  sendOtp: (message: ViberOtp) => Promise<SendViberResult>;
  /**
   * Send pre-approved template message
   * Usage: transactional/OTP message
   */
  // sendTemplateMsg: (message: ViberTemplateMessage) => Promise<SendViberResult>;
  // /**
  //  * Send free-form messages with UI components (Eg: image, carousel, text)
  //  * Usage: conversational/promotional message
  //  */
  // sendMsg: (message: ViberTemplateMessage) => Promise<SendViberResult>;
}
