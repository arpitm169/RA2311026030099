"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    { href: '/', label: 'All Notifications', icon: '📋' },
    { href: '/priority', label: 'Priority Inbox', icon: '⚡' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
      padding: '0 24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
          }}>
            🔔
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}>
            NotifyHub
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '4px', padding: '4px', background: '#f1f5f9', borderRadius: '12px' }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isHovered = hoveredLink === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#fff' : '#64748b',
                  background: isActive
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : isHovered ? 'rgba(0,0,0,0.04)' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                  textDecoration: 'none',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '15px' }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
          }} />
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
            Live
          </span>
        </div>
      </div>
    </nav>
  );
}
