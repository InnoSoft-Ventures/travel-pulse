import {
	AppSidebar,
	AppTopBar,
	SettingsTabs,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@travelpulse/ui';

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<SettingsTabs />

			<div>{children}</div>
		</div>
	);
}
