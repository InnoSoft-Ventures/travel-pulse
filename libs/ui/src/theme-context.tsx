'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Theme {
	footer: 'dark' | 'light';
	header?: 'dark' | 'light';
	background?: 'dark' | 'light';
}

const defaultTheme: Theme = {
	footer: 'dark',
	header: 'light',
	background: 'light',
};

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Partial<Theme>) => void;
	resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
	theme: defaultTheme,
	setTheme: () => {},
	resetTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(defaultTheme);

	const setTheme = useCallback((newTheme: Partial<Theme>) => {
		setThemeState((prev) => ({ ...prev, ...newTheme }));
	}, []);

	const resetTheme = useCallback(() => setThemeState(defaultTheme), []);

	const value = React.useMemo(
		() => ({ theme, setTheme, resetTheme }),
		[theme, setTheme, resetTheme]
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};
