'use client';

import React, { useState, useEffect, FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeSwitcher: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine the current computed theme
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const ICON_SIZE = 16;
  const getIcon = () => {
    switch (currentTheme) {
      case 'light':
        return (
          <Sun size={ICON_SIZE} className="text-muted-foreground" key="light" />
        );
      case 'dark':
        return (
          <Moon size={ICON_SIZE} className="text-muted-foreground" key="dark" />
        );
      default:
        return (
          <Laptop
            size={ICON_SIZE}
            className="text-muted-foreground"
            key="system"
          />
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value: string) =>
            setTheme(value as 'light' | 'dark' | 'system')
          }>
          <DropdownMenuRadioItem
            className="flex items-center gap-2"
            value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="flex items-center gap-2"
            value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="flex items-center gap-2"
            value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
