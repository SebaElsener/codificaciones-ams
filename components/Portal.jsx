import { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  const [nodes, setNodes] = useState([]);

  const mount = (node) => {
    const key = Math.random().toString();
    setNodes((prev) => [...prev, { key, node }]);
    return key;
  };

  const update = (key, node) => {
    setNodes((prev) => prev.map((n) => (n.key === key ? { key, node } : n)));
  };

  const unmount = (key) => {
    setNodes((prev) => prev.filter((n) => n.key !== key));
  };

  const clear = () => {
    setNodes([]);
  };

  return (
    <PortalContext.Provider value={{ mount, update, unmount, clear }}>
      {children}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {nodes.map((n) => (
          <View
            key={n.key}
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
          >
            {n.node}
          </View>
        ))}
      </View>
    </PortalContext.Provider>
  );
}

export function usePortal() {
  return useContext(PortalContext);
}
