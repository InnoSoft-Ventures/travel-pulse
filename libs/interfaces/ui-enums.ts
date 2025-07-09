export enum UIPlanTabs {
	Local,
	Regional,
	Global,
}

// I want to assign the enum values to string literals
export const UIPlanTabsMap: Record<UIPlanTabs, string> = {
	[UIPlanTabs.Local]: 'local',
	[UIPlanTabs.Regional]: 'regional',
	[UIPlanTabs.Global]: 'global',
};
