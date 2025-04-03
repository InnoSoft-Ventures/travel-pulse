declare module '*.svg';
declare module '*.svg?image';
declare module '*.png';
declare module '*.jpg';
declare module '*.module.scss' {
	const classes: { readonly [key: string]: string };
	export default classes;
}
