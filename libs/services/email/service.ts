import { createTransport } from './transport';
import { renderTemplate } from './templates';
import { getEnv } from '@travelpulse/utils';
import type {
	EmailTransportConfig,
	SendTemplateEmailOptions,
	TemplateName,
} from './types/types';

export class EmailService {
	private static instance: EmailService | null = null;
	private constructor(private readonly config: EmailTransportConfig) {}

	static init() {
		const config = {
			host: getEnv('SMTP_HOST', 'localhost'),
			port: parseInt(getEnv('SMTP_PORT', '1025'), 10),
			secure: getEnv('SMTP_SECURE', 'false') === 'true',
			auth:
				getEnv('SMTP_USER') && getEnv('SMTP_PASS')
					? { user: getEnv('SMTP_USER'), pass: getEnv('SMTP_PASS') }
					: null,
			fromAddress: getEnv(
				'MAIL_FROM_ADDRESS',
				'no-reply@travelpulse.local'
			),
			fromName: getEnv('MAIL_FROM_NAME', 'TravelPulse'),
		};

		this.instance = new EmailService(config);
		return this.instance;
	}

	static getInstance() {
		if (!this.instance) {
			throw new Error(
				'EmailService not initialized. Call EmailService.init(...) first.'
			);
		}
		return this.instance;
	}

	async send<T extends TemplateName>(opts: SendTemplateEmailOptions<T>) {
		const transport = createTransport(this.config);

		const compiled = renderTemplate(opts.template, {
			...opts.data,
			appName: getEnv('APP_NAME', 'TravelPulse'),
			// could pass locale/dir via global Handlebars if needed; renderer reads defaults
		} as any);

		const from = this.config.fromName
			? `${this.config.fromName} <${this.config.fromAddress}>`
			: this.config.fromAddress;

		await transport.sendMail({
			from,
			to: opts.to as any,
			cc: opts.cc as any,
			bcc: opts.bcc as any,
			replyTo: opts.replyTo as any,
			subject: opts.subject || compiled.subject,
			html: compiled.html,
			text: compiled.text,
			attachments: opts.attachments as any,
		});
	}
}
