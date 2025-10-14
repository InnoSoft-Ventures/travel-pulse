import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import Handlebars from 'handlebars';

export interface RenderOptions<T = Record<string, any>> {
	templatesDir?: string; // base templates directory
	locale?: string; // e.g., 'en-ZA'
	name: string; // template name, e.g., 'account-verify'
	subject: string; // handlebars subject template
	data: T; // payload for template
}

const DEFAULT_LOCALE = 'en-ZA';

const ensurePath = (...p: string[]) => path.normalize(path.join(...p));

const defaultTemplatesDir = ensurePath(__dirname, 'templates');

const read = (p: string) => fs.readFileSync(p, 'utf8');

const compileText = (source: string, data: any) =>
	Handlebars.compile(source)(data);

const loadPartials = (partialsDir: string) => {
	if (!fs.existsSync(partialsDir)) return;
	const files = fs
		.readdirSync(partialsDir)
		.filter((f) => f.endsWith('.mjml'));
	for (const file of files) {
		const name = path.basename(file, '.mjml');
		const content = read(path.join(partialsDir, file));
		Handlebars.registerPartial(name, content);
	}
};

export const renderMjmlTemplate = <T extends Record<string, any>>(
	opts: RenderOptions<T>
) => {
	const baseDir = opts.templatesDir || defaultTemplatesDir;
	const locale = opts.locale || DEFAULT_LOCALE;
	const data = { appName: 'TravelPulse', ...opts.data } as any;

	// Load partials once per render (safe for short-lived process); in longer-lived process, callers can cache
	loadPartials(path.join(baseDir, 'partials'));

	// layout
	const layoutPath = ensurePath(baseDir, locale, 'layout.mjml');
	const layoutSource = fs.existsSync(layoutPath)
		? read(layoutPath)
		: '<mjml><mj-body>{{{body}}}</mj-body></mjml>';

	// body mjml
	const bodyPath = ensurePath(baseDir, locale, `${opts.name}.mjml`);
	if (!fs.existsSync(bodyPath)) {
		throw new Error(`Email template not found: ${bodyPath}`);
	}
	const bodySource = read(bodyPath);

	// combine: render body first, then inject into layout via {{> body}} or {{{body}}}
	const bodyRenderedMjml = compileText(bodySource, data);

	// Provide body as variable for layout
	const layoutCompiled = compileText(layoutSource, {
		...data,
		body: bodyRenderedMjml,
	});

	// convert mjml -> html
	const { html, errors } = mjml2html(layoutCompiled, {
		validationLevel: 'soft',
	});
	if (errors && errors.length) {
		// eslint-disable-next-line no-console
		console.warn('MJML validation issues:', errors);
	}

	// text fallback
	const textPath = ensurePath(
		baseDir,
		locale,
		'text',
		`${opts.name}.txt.hbs`
	);
	const text = fs.existsSync(textPath)
		? compileText(read(textPath), data)
		: '';

	// subject
	const subject = compileText(opts.subject, data);

	return { subject, html, text };
};
