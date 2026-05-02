"use client";

import React, { useEffect, useState } from 'react';
import { useNotificationContext } from '../../context/NotificationContext';
// @ts-ignore
import { Log } from 'logging-middleware';

interface Notification { ID: string; Type: string; Message: string; Timestamp: string; }

const typeConfig: Record<string, { gradient: string; icon: string; color: string; lightBg: string }> = {
  Placement: { gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', icon: '💼', color: '#059669', lightBg: '#ecfdf5' },
  Result: { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '📊', color: '#d97706', lightBg: '#fffbeb' },
  Event: { gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', icon: '🎉', color: '#7c3aed', lightBg: '#f5f3ff' },
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { viewedIds, markAsViewed } = useNotificationContext();

  const fetchNotifications = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${p}&limit=5`);
      const data = await res.json();
      setNotifications(data.notifications);
      setTotalPages(data.totalPages);
      Log("Frontend", "info", "AllNotifications", `Fetched page ${p}`);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(page); }, [page]);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 8px 0' }}>All Notifications</h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>Browse and manage all campus notifications</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: notifications.length, color: '#3b82f6' },
          { label: 'Unread', value: notifications.filter(n => !viewedIds.includes(n.ID)).length, color: '#f43f5e' },
          { label: 'Page', value: `${page} / ${totalPages}`, color: '#8b5cf6' },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: '12px 20px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color, boxShadow: `0 0 6px ${stat.color}40` }} />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((n, idx) => {
            const isNew = !viewedIds.includes(n.ID);
            const cfg = typeConfig[n.Type] || typeConfig.Event;
            return (
              <div key={n.ID} className="notification-card" onClick={() => { if (isNew) { markAsViewed(n.ID); Log("Frontend", "info", "AllNotifications", `Viewed ${n.ID}`); } }}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: isNew ? cfg.lightBg : '#fff', border: `1px solid ${isNew ? cfg.color + '25' : 'rgba(0,0,0,0.07)'}`, borderRadius: '12px', cursor: 'pointer', transition: 'all 250ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', animationDelay: `${idx * 0.04}s` }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 4px 16px ${cfg.color}18`; el.style.borderColor = cfg.color + '40'; el.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; el.style.borderColor = isNew ? cfg.color + '25' : 'rgba(0,0,0,0.07)'; el.style.transform = 'translateY(0)'; }}
              >
                {isNew && <div className="unread-dot" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />}
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: cfg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', flexShrink: 0, boxShadow: `0 2px 8px ${cfg.color}30` }}>{cfg.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: cfg.color }}>{n.Type}</span>
                    {isNew && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}>NEW</span>}
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: isNew ? 600 : 400, color: isNew ? '#0f172a' : '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{n.Message}</p>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{formatTimestamp(n.Timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px', paddingBottom: '24px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => setPage(p)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: page === p ? 'none' : '1px solid rgba(0,0,0,0.07)', background: page === p ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#fff', color: page === p ? '#fff' : '#64748b', fontSize: '14px', fontWeight: page === p ? 700 : 500, cursor: 'pointer', transition: 'all 200ms ease', boxShadow: page === p ? '0 2px 8px rgba(59,130,246,0.3)' : '0 1px 3px rgba(0,0,0,0.04)' }}>{p}</button>
        ))}
      </div>
    </div>
  );
}
