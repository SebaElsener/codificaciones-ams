import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dropdown({
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
}) {
  const animation = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  const open = isOpen === id;

  const selectedIndex = data.findIndex((d) => d.value === selectedValue);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // scroll al seleccionado
    if (open && selectedIndex >= 0 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          y: selectedIndex * 45,
          animated: true,
        });
      }, 100);
    }
  }, [open]);

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const selectedItem = data.find((d) => d.value === selectedValue);

  return (
    <View style={{ marginBottom: 10 }}>
      {/* 🔍 búsqueda */}
      {searchable && (
        <TextInput
          placeholder="Buscar área..."
          value={searchValue}
          onChangeText={onSearchChange}
          style={{
            borderBottomWidth: 1,
            borderColor: "#ccc",
            marginBottom: 5,
          }}
        />
      )}

      {/* 🔘 selector */}
      <TouchableOpacity
        onPress={() => setOpenId(open ? null : id)}
        style={{
          borderBottomWidth: 1,
          borderColor: open ? "#54bca2" : "#ccc",
          padding: 12,
          borderRadius: 6,
        }}
      >
        <Text style={{ fontWeight: "500" }}>
          {selectedItem
            ? `${selectedItem.value} - ${selectedItem.label}`
            : placeholder}
        </Text>
      </TouchableOpacity>

      {/* 📋 lista animada */}
      <Animated.View
        style={{
          overflow: "hidden",
          height: heightInterpolate,
        }}
      >
        <ScrollView ref={scrollRef}>
          {data.map((item) => {
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
                  style={{
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
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
}
