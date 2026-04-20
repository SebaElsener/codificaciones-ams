import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePortal } from "../components/Portal";

export default function Dropdown(props) {
  const {
    data = [],
    selectedValue,
    onSelect,
    placeholder = "Seleccionar",
    searchable = false,
    searchValue = "",
    onSearchChange = () => {},
    isOpen,
    setOpenId,
    id,
    active,
  } = props;

  const animation = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const triggerRef = useRef(null);

  const { mount, update, unmount } = usePortal();
  const [portalKey, setPortalKey] = useState(null);

  const [layout, setLayout] = useState(null);

  const open = isOpen === id;
  const DROPDOWN_HEIGHT = 200;

  useEffect(() => {
    if (!open) {
      if (portalKey) {
        unmount(portalKey);
        setPortalKey(null);
      }
      animation.setValue(0);
    }
  }, [open, portalKey]);

  useEffect(() => {
    if (!active) {
      if (portalKey) {
        unmount(portalKey);
        setPortalKey(null);
      }
    }
  }, [active]);

  // useEffect(() => {
  //   if (!open) {
  //     animation.setValue(0);
  //   }
  // }, [open]);

  // useEffect(() => {
  //   return () => {
  //     if (portalKey) {
  //       unmount(portalKey);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (open) {
      // medir posición real en pantalla
      triggerRef.current.measureInWindow((x, y, w, h) => {
        const screenHeight = Dimensions.get("window").height;
        const screenWidth = Dimensions.get("window").width;

        // 🎯 centrado vertical respecto a la card (≈ pantalla)
        const centeredTop = (screenHeight - DROPDOWN_HEIGHT) / 1.5 - 30;

        // 🎯 centrado horizontal
        const centeredWidth = Math.min(screenWidth * 0.85, 320);
        const centeredLeft = (screenWidth - centeredWidth) / 2;

        const newLayout = {
          top: centeredTop,
          left: centeredLeft,
          width: centeredWidth,
        };

        setLayout(newLayout);

        // 👇 MUY IMPORTANTE: usar el mismo layout
        const key = mount(renderDropdown(newLayout));
        setPortalKey(key);

        Animated.timing(animation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    } else {
      if (portalKey) {
        unmount(portalKey);
        setPortalKey(null);
      }
      animation.setValue(0);
    }
  }, [open]);

  // actualizar portal cuando anima
  useEffect(() => {
    if (portalKey && layout) {
      update(portalKey, renderDropdown(layout));
    }
  }, [animation, searchValue]);

  const renderDropdown = useCallback(
    ({ top, left, width }) => {
      const heightInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, DROPDOWN_HEIGHT],
      });

      const filteredData = data.filter((item) =>
        `${item.value} ${item.label}`
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
      );

      return (
        <View
          style={{
            position: "absolute",
            top,
            left,
            width,
            zIndex: 9999,
          }}
        >
          <Animated.View
            style={{
              height: heightInterpolate,
              overflow: "hidden",
              backgroundColor: "#fff",
              borderRadius: 6,
              elevation: 10,
            }}
          >
            {searchable && (
              <TextInput
                placeholder="Buscar..."
                value={searchValue}
                onChangeText={onSearchChange}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  backgroundColor: "#fff",
                }}
              />
            )}

            <ScrollView ref={scrollRef}>
              {filteredData.map((item) => {
                const isSelected = item.value === selectedValue;

                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      onSelect(item);
                      setOpenId(null);
                    }}
                    style={{
                      padding: 10,
                      borderBottomWidth: 0.5,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text
                      style={{ fontWeight: isSelected ? "bold" : "normal" }}
                    >
                      {item.value} - {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      );
    },
    [animation, data, searchValue, selectedValue],
  );

  const selectedItem = data.find((d) => d.value === selectedValue);

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        ref={triggerRef}
        onPress={() => setOpenId(open ? null : id)}
        style={{
          borderBottomWidth: 1,
          borderColor: open ? "#54bca2" : "#ccc",
          padding: 12,
        }}
      >
        <Text>
          {selectedItem
            ? `${selectedItem.value} - ${selectedItem.label}`
            : placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
