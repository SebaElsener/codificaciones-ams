import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Text from "./AppText";
import TextInput from "./AppTextInput";

export default function Areas({
  areas,
  selectedValue,
  onSelect,
  searchValue,
  onSearchChange,
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 10 }}>
      {/* Input búsqueda */}
      <TextInput
        placeholder="Buscar área..."
        value={searchValue}
        onChangeText={onSearchChange}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 5,
          marginBottom: 5,
        }}
      />

      {/* Selector */}
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
            ? areas.find((a) => a.value === selectedValue)?.value +
              " - " +
              areas.find((a) => a.value === selectedValue)?.label
            : "Seleccionar área"}
        </Text>
      </TouchableOpacity>

      {/* Lista */}
      {open && (
        <FlatList
          style={{ maxHeight: 200, marginTop: 5 }}
          data={areas}
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
