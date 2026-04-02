import { createContext, useContext, useState } from "react";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  const [activePage, setActivePage] = useState("home"); // "home" | "create_post" | "view_post"
  const [activePostId, setActivePostId] = useState(null);

  return (
    <PageContext.Provider value={{ activePage, setActivePage, activePostId, setActivePostId }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const ctx = useContext(PageContext);
  if (!ctx) {
    throw new Error("usePage must be used within PageProvider");
  }
  return ctx;
}
