import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";

const GameTtsContext = createContext<string>("");

export function GameTtsProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <GameTtsContext.Provider value={pathname}>
      {children}
    </GameTtsContext.Provider>
  );
}

export function useGameTtsKey() {
  return useContext(GameTtsContext);
}
