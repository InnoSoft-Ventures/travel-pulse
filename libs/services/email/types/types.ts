import { TemplatePayloadMap } from './email-types';

export type EmailAddress = string | { name?: string; address: string };

export type TemplateName = keyof TemplatePayloadMap;

export type TemplateData<T extends TemplateName = TemplateName> =
	T extends keyof TemplatePayloadMap ? TemplatePayloadMap[T] : never;

export interface SendTemplateEmailOptions<
	T extends TemplateName = TemplateName
> {
	to: EmailAddress | EmailAddress[];
	cc?: EmailAddress | EmailAddress[];
	bcc?: EmailAddress | EmailAddress[];
	replyTo?: EmailAddress;
	subject?: string; // Optional override; defaults from template
	template: T;
	data: TemplateData<T>;
	attachments?: Array<{
		filename: string;
		// Use unknown to avoid requiring Node's Buffer type in ambient context
		content: unknown; // string | Buffer
		contentType?: string;
		cid?: string; // for inline images
		path?: string;
	}>;
}

export interface EmailRendererOptions {
	templatesDir?: string;
	locale?: string; // e.g., en-ZA
}

export interface EmailTransportConfig {
	host: string;
	port: number;
	secure: boolean;
	auth?: { user: string; pass: string } | null;
	fromAddress: string;
	fromName?: string;
}
