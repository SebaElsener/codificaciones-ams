import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Averias({ averias, selectedValue, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 5,
          backgroundColor: "#f2f2f2",
        }}
      >
        <Text>
          {selectedValue
            ? averias.find((a) => a.value === selectedValue)?.value +
              " - " +
              averias.find((a) => a.value === selectedValue)?.label
            : "Seleccionar avería"}
        </Text>
      </TouchableOpacity>

      {open && (
        <FlatList
          style={{ maxHeight: 200, marginTop: 5 }}
          data={averias}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
              style={{ padding: 10, borderBottomWidth: 0.5 }}
            >
              <Text>
                {item.value} - {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
