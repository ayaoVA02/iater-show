import { createContext, useContext, useState } from "react";

const HoverContext = createContext();

export const HoverProvider = ({ children }) => {
  const [activeBox, setActiveBox] = useState(null);

  const clearActiveBox = () => setActiveBox(null);

  return (
    <HoverContext.Provider value={{ activeBox, setActiveBox, clearActiveBox }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHoverBox = () => useContext(HoverContext);
