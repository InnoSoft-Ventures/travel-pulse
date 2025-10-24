import { renderMjmlTemplate } from './mjmlRenderer';
import type { TemplateName } from './types/types';
import type { TemplatePayloadMap } from './types/email-types';

const SUBJECTS: Record<TemplateName, string> = {
	'account-verify': '{{appName}}: Verify your email',
	'password-reset': '{{appName}}: Reset your password',
	'payment-confirmed': '{{appName}}: Payment received for order {{orderId}}',
	'order-confirmation':
		'{{appName}}: Your order {{orderNumber}} is confirmed',
};

export const renderTemplate = <T extends TemplateName>(
	name: T,
	data: TemplatePayloadMap[T]
) => {
	return renderMjmlTemplate({
		name,
		subject: SUBJECTS[name],
		data: data as any,
	});
};
