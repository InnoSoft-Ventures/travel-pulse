export enum UIPlanType {
	Local,
	Regional,
	Global,
}

// I want to assign the enum values to string literals
export const UIPlanTypeMap: Record<UIPlanType, string> = {
	[UIPlanType.Local]: 'local',
	[UIPlanType.Regional]: 'regional',
	[UIPlanType.Global]: 'global',
};
