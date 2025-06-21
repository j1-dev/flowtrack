'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Plus } from 'lucide-react';

interface NavbarProps {
  onCreateTask: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateTask }) => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile menu button (fixed, top left) */}
      <button
        className="w-6 h-6 absolute top-[30px] left-4 z-40 md:hidden p-2 "
        onClick={() => setOpen(true)}
        aria-label="Open menu">
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      {/* Navbar: always visible on desktop, only visible on mobile when open */}
      <nav
        className={`fixed top-0 left-0 h-screen bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:flex
          ${collapsed ? 'w-16' : 'w-64'} md:transition-none md:translate-x-0`}
        style={{ minWidth: collapsed ? '4rem' : '16rem', maxWidth: '16rem' }}
        aria-label="Sidebar">
        {/* Close button for mobile drawer, only when open */}
        {open && (
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-bold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>
        )}
        {/* New Task button: only on desktop */}
        <div className="hidden md:flex flex-1 flex-col">
          <Button
            variant="ghost"
            className="my-2 flex items-center gap-2 justify-start"
            onClick={onCreateTask}>
            <Plus className="w-5 h-5" />
            {!collapsed && <span>New Task</span>}
          </Button>
          {/* Add more nav items here if needed */}
        </div>
        {/* Collapse/expand button for desktop, always visible in nav bottom */}
        <div className="hidden md:flex items-center justify-center p-2 border-t mt-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle collapse">
            {collapsed ? <Menu /> : <X />}
          </Button>
        </div>
      </nav>
    </>
  );
};
