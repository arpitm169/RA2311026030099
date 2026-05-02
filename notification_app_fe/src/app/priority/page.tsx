"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useNotificationContext } from '../../../context/NotificationContext';
// @ts-ignore
import { Log } from 'logging-middleware';

interface Notification { ID: string; Type: string; Message: string; Timestamp: string; }

const TYPE_WEIGHT: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };

const typeConfig: Record<string, { gradient: string; icon: string; color: string; lightBg: string }> = {
  Placement: { gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', icon: '💼', color: '#059669', lightBg: '#ecfdf5' },
  Result: { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '📊', color: '#d97706', lightBg: '#fffbeb' },
  Event: { gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', icon: '🎉', color: '#7c3aed', lightBg: '#f5f3ff' },
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts); const now = new Date(); const diff = now.getTime() - d.getTime(); const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [limitN, setLimitN] = useState<number>(10);
  const [filterType, setFilterType] = useState<string>('All');
  const { viewedIds, markAsViewed } = useNotificationContext();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try { const res = await fetch(`/api/notifications?limit=50`); const data = await res.json(); setNotifications(data.notifications); Log("Frontend", "info", "PriorityInbox", "Fetched"); }
      catch (error) { console.error("Failed to fetch", error); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const prioritizedAndFiltered = useMemo(() => {
    let result = [...notifications];
    if (filterType !== 'All') result = result.filter(n => n.Type === filterType);
    result.sort((a, b) => { const wA = TYPE_WEIGHT[a.Type] || 0; const wB = TYPE_WEIGHT[b.Type] || 0; if (wA !== wB) return wB - wA; return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(); });
    return result.slice(0, limitN);
  }, [notifications, filterType, limitN]);

  const filterOptions = ['All', 'Placement', 'Result', 'Event'];
  const limitOptions = [5, 10, 15, 20];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 8px 0' }}>⚡ Priority Inbox</h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>Notifications ranked by <span style={{ color: '#3b82f6', fontWeight: 600 }}>weight</span> and <span style={{ color: '#8b5cf6', fontWeight: 600 }}>recency</span></p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', background: '#f1f5f9', borderRadius: '12px' }}>
          {filterOptions.map((opt) => {
            const isActive = filterType === opt;
            const optColor = opt === 'All' ? '#3b82f6' : (typeConfig[opt]?.color || '#3b82f6');
            return (
              <button key={opt} onClick={() => { setFilterType(opt); Log("Frontend", "info", "PriorityInbox", `Filter: ${opt}`); }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: isActive ? (opt === 'All' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : typeConfig[opt]?.gradient || '#3b82f6') : 'transparent', color: isActive ? '#fff' : '#64748b', fontSize: '13px', fontWeight: isActive ? 600 : 500, cursor: 'pointer', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: isActive ? `0 2px 8px ${optColor}30` : 'none' }}>
                {opt !== 'All' && <span style={{ fontSize: '14px' }}>{typeConfig[opt]?.icon}</span>}
                {opt}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', background: '#f1f5f9', borderRadius: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8', padding: '0 8px', fontWeight: 500 }}>Show:</span>
          {limitOptions.map((opt) => {
            const isActive = limitN === opt;
            return (
              <button key={opt} onClick={() => { setLimitN(opt); Log("Frontend", "info", "PriorityInbox", `TopN: ${opt}`); }}
                style={{ width: '36px', height: '32px', borderRadius: '8px', border: 'none', background: isActive ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'transparent', color: isActive ? '#fff' : '#64748b', fontSize: '13px', fontWeight: isActive ? 700 : 500, cursor: 'pointer', transition: 'all 200ms ease', boxShadow: isActive ? '0 2px 6px rgba(139,92,246,0.3)' : 'none' }}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#3b82f6' }}>{prioritizedAndFiltered.length}</span>
        <span>results</span>
        {filterType !== 'All' && <span style={{ padding: '2px 8px', borderRadius: '6px', background: typeConfig[filterType]?.lightBg, color: typeConfig[filterType]?.color, fontSize: '11px', fontWeight: 600 }}>{filterType}</span>}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />))}
        </div>
      ) : prioritizedAndFiltered.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 4px' }}>No notifications found</p>
          <p style={{ fontSize: '14px', margin: 0 }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prioritizedAndFiltered.map((n, idx) => {
            const isNew = !viewedIds.includes(n.ID);
            const cfg = typeConfig[n.Type] || typeConfig.Event;
            const weight = TYPE_WEIGHT[n.Type] || 0;
            return (
              <div key={n.ID} className="notification-card" onClick={() => { if (isNew) { markAsViewed(n.ID); } }}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: isNew ? cfg.lightBg : '#fff', border: `1px solid ${isNew ? cfg.color + '25' : 'rgba(0,0,0,0.07)'}`, borderRadius: '12px', cursor: 'pointer', transition: 'all 250ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', animationDelay: `${idx * 0.04}s` }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 4px 16px ${cfg.color}18`; el.style.borderColor = cfg.color + '40'; el.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; el.style.borderColor = isNew ? cfg.color + '25' : 'rgba(0,0,0,0.07)'; el.style.transform = 'translateY(0)'; }}
              >
                {/* Rank */}
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: idx < 3 ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: idx < 3 ? '#fff' : '#64748b', flexShrink: 0, boxShadow: idx < 3 ? '0 2px 6px rgba(59,130,246,0.25)' : 'none' }}>
                  {idx + 1}
                </div>
                {isNew && <div className="unread-dot" style={{ position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#f43f5e' }} />}
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: cfg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, boxShadow: `0 2px 8px ${cfg.color}30` }}>{cfg.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: cfg.color }}>{n.Type}</span>
                    {isNew && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}>NEW</span>}
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: isNew ? 600 : 400, color: isNew ? '#0f172a' : '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{n.Message}</p>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 600, color: cfg.color, flexShrink: 0 }}>W{weight}</div>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{formatTimestamp(n.Timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
