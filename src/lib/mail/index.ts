import { APP_CONFIG } from '~/config/app.config';
import { env } from '~/env';
import { Resend } from 'resend';

interface MailOptions {
  to: string[]
  subject: string
  html: string
  // TODO: Add optional react, plain text
}

interface MailAdapter {
  send: (options: MailOptions) => Promise<void>
}

export const consoleAdapter: MailAdapter = {
  send: async (options: MailOptions) => {
    return Promise.resolve().then(() => {
      console.log('Console Mail TO: ', options.to)
      console.log('Console Mail Subject: ', options.subject)
      console.log('Console Mail HTML: ', options.html)
    })
  }
}

export const resendAdapter: MailAdapter = {
  send: async (options: MailOptions) => {
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `${APP_CONFIG.fromName} <${APP_CONFIG.fromEmail}>`,
      to: options.to,
      subject: options.subject,
      //react: options.html,
      html: options.html,
    });

    if (error) {
      console.error('Error sending mail: ', error)
      throw new Error(error.message)
    }
    console.log('Mail sent: ', data)

    return Promise.resolve()
  }
}

// Force the use of the adapter to send a mail
export function sendMailWithAdapter(adapter: MailAdapter, options: MailOptions) {
  return adapter.send(options)
}

// Send a mail with the adapter defined in the env
export function sendMail(options: MailOptions) {
  if (APP_CONFIG.emailProvider.includes('CONSOLE')) {
    return sendMailWithAdapter(consoleAdapter, options)
  }
  if (APP_CONFIG.emailProvider.includes('RESEND')) {
    return sendMailWithAdapter(resendAdapter, options)
  }
}


