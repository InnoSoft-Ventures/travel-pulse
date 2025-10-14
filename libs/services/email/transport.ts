import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailTransportConfig } from './types/types';

export const createTransport = (cfg: EmailTransportConfig) => {
	const smtpOptions: SMTPTransport.Options = {
		host: cfg.host,
		port: cfg.port,
		secure: cfg.secure,
		auth: cfg.auth ?? undefined,
	};

	return nodemailer.createTransport(smtpOptions);
};
