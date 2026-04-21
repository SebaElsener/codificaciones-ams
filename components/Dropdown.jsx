import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { usePortal } from "../components/Portal";
import Text from "./AppText";
import TextInput from "./AppTextInput";

const DROPDOWN_HEIGHT = 200;
const SEARCH_HEIGHT = 44;

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
  } = props;

  const animation = useRef(new Animated.Value(0)).current;
  const triggerRef = useRef(null);

  const { mount, update, unmount } = usePortal();
  const [portalKey, setPortalKey] = useState(null);
  const [layout, setLayout] = useState(null);

  const open = isOpen === id;

  // 🔑 refs que siempre apuntan a las últimas props
  const latest = useRef({
    onSelect,
    setOpenId,
    onSearchChange,
    data,
    selectedValue,
    searchValue,
    searchable,
  });
  latest.current = {
    onSelect,
    setOpenId,
    onSearchChange,
    data,
    selectedValue,
    searchValue,
    searchable,
  };

  const renderDropdown = useCallback(
    ({ top, left, width }) => {
      const heightInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          0,
          DROPDOWN_HEIGHT + (latest.current.searchable ? SEARCH_HEIGHT : 0),
        ],
      });

      const {
        data,
        selectedValue,
        searchValue,
        onSearchChange,
        onSelect,
        setOpenId,
        searchable,
      } = latest.current;

      const filteredData = data.filter((item) =>
        `${item.value} ${item.label}`
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
      );

      return (
        // 👇 height explícito para que iOS registre los touches
        <Animated.View
          style={{
            position: "absolute",
            top,
            left,
            width,
            height: heightInterpolate,
            overflow: "hidden",
            backgroundColor: "#fff",
            borderRadius: 6,
            elevation: 10,
            zIndex: 9999,
          }}
        >
          {searchable && (
            <TextInput
              placeholder="Buscar..."
              value={searchValue}
              onChangeText={(t) => latest.current.onSearchChange(t)}
              style={{
                borderBottomWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                fontSize: 18,
                backgroundColor: "#fff",
              }}
            />
          )}

          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredData.map((item) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    latest.current.onSelect(item);
                    latest.current.setOpenId(null); // ✅ cierra el portal
                  }}
                  style={{
                    padding: 10,
                    borderBottomWidth: 0.5,
                    borderColor: "#ccc",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {item.value} - {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      );
    },
    [animation],
  );

  // abrir / cerrar
  useEffect(() => {
    if (open) {
      triggerRef.current.measureInWindow(() => {
        const screenHeight = Dimensions.get("window").height;
        const screenWidth = Dimensions.get("window").width;

        const centeredTop = (screenHeight - DROPDOWN_HEIGHT) / 1.7 - 40;
        const centeredWidth = Math.min(screenWidth * 0.85, 320);
        const centeredLeft = (screenWidth - centeredWidth) / 2;

        const newLayout = {
          top: centeredTop,
          left: centeredLeft,
          width: centeredWidth,
        };
        setLayout(newLayout);

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
      setLayout(null);
      animation.setValue(0);
    }
    return () => {
      if (portalKey) unmount(portalKey);
    };
  }, [open]);

  // re-push del snapshot cuando cambian cosas que el portal debe reflejar
  useEffect(() => {
    if (portalKey && layout) {
      update(portalKey, renderDropdown(layout));
    }
  }, [portalKey, layout, data, selectedValue, searchValue, searchable]);

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
        <Text style={{ fontSize: 18 }}>
          {selectedItem
            ? `${selectedItem.value} - ${selectedItem.label}`
            : placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
