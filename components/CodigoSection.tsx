import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import Dropdown from "../components/Dropdown";

export default function CodigoSection({
  title,
  areasJson,
  averiasJson,
  gravedadesJson,
  active,
  animatedColor,
}) {
  const [area, setArea] = useState("");
  const [averia, setAveria] = useState("");
  const [grav, setGrav] = useState("");

  const [areaSearch, setAreaSearch] = useState("");
  const [filteredAreas, setFilteredAreas] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null);

  // 🔹 transformar JSON → dropdown
  const areasDropdown = areasJson.map((p) => ({
    label: p.descripcion,
    value: p.id,
  }));

  const averiasDropdown = averiasJson.map((p) => ({
    label: p.descripcion,
    value: p.id,
  }));

  const gravedadesDropdown = gravedadesJson.map((p) => ({
    label: p.descripcion,
    value: p.id,
  }));

  useEffect(() => {
    if (!active) {
      // 🔄 reset completo
      setArea("");
      setAveria("");
      setGrav("");

      setAreaSearch("");
      setFilteredAreas(areasDropdown);

      setOpenDropdown(null);
    }
  }, [active]);

  // 🔹 filtro búsqueda
  useEffect(() => {
    if (!areaSearch) {
      setFilteredAreas(areasDropdown);
    } else {
      setFilteredAreas(
        areasDropdown.filter((item) =>
          item.label.toLowerCase().includes(areaSearch.toLowerCase()),
        ),
      );
    }
  }, [areaSearch, areasDropdown]);

  // 🔹 obtener objeto seleccionado completo
  const selectedArea = areasDropdown.find((a) => a.value === area);
  const selectedAveria = averiasDropdown.find((a) => a.value === averia);
  const selectedGrav = gravedadesDropdown.find((g) => g.value === grav);

  // 🔹 código compacto
  const codigo = area && averia && grav ? `${area}-${averia}-${grav}` : null;

  return (
    <Animated.View
      style={{
        //flex: 1,
        padding: 15,
        backgroundColor: animatedColor,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      <Dropdown
        id="areas"
        isOpen={openDropdown}
        setOpenId={setOpenDropdown}
        data={filteredAreas}
        selectedValue={area}
        onSelect={(item) => setArea(item.value)}
        placeholder="Seleccionar área"
        searchable
        searchValue={areaSearch}
        onSearchChange={setAreaSearch}
      />

      <Dropdown
        id="averias"
        isOpen={openDropdown}
        setOpenId={setOpenDropdown}
        data={averiasDropdown}
        selectedValue={averia}
        onSelect={(item) => setAveria(item.value)}
        placeholder="Seleccionar avería"
      />

      <Dropdown
        id="gravedades"
        isOpen={openDropdown}
        setOpenId={setOpenDropdown}
        data={gravedadesDropdown}
        selectedValue={grav}
        onSelect={(item) => setGrav(item.value)}
        placeholder="Seleccionar gravedad"
      />

      {/* 🔥 RESULTADO */}
      {codigo && (
        <View style={{ marginTop: 15 }}>
          {/* Código */}
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {codigo}
          </Text>

          {/* Detalle */}
          <Text style={{ marginTop: 5 }}>
            {selectedArea && `${selectedArea.value} - ${selectedArea.label}`}
          </Text>

          <Text style={{ marginTop: 5 }}>
            {selectedAveria &&
              `${selectedAveria.value} - ${selectedAveria.label}`}
          </Text>

          <Text style={{ marginTop: 5 }}>
            {selectedGrav && `${selectedGrav.value} - ${selectedGrav.label}`}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
