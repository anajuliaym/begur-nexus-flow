import { createContext, useContext, useState, ReactNode } from "react";

export type Mode = "real" | "target";

interface Ctx {
  mode: Mode;
  setMode: (m: Mode) => void;
  is: (m: Mode) => boolean;
}

const ModeContext = createContext<Ctx>({ mode: "real", setMode: () => {}, is: () => false });

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("real");
  return (
    <ModeContext.Provider value={{ mode, setMode, is: (m) => mode === m }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
