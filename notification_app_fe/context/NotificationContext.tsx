"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
  viewedIds: string[];
  markAsViewed: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  viewedIds: [],
  markAsViewed: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('viewed_notifications');
    if (stored) {
      try {
        setViewedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse viewed notifications from local storage");
      }
    }
  }, []);

  const markAsViewed = (id: string) => {
    setViewedIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem('viewed_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <NotificationContext.Provider value={{ viewedIds, markAsViewed }}>
      {children}
    </NotificationContext.Provider>
  );
};
