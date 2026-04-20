import { useEffect, useState } from "react";
import { Animated, Text } from "react-native";
import Dropdown from "../components/Dropdown";

export default function CodigoSection({
  title,
  areasJson,
  averiasJson,
  gravedadesJson,
  active,
  isOpen,
  setOpenId,
}) {
  const [area, setArea] = useState("");
  const [averia, setAveria] = useState("");
  const [grav, setGrav] = useState("");

  const [areaSearch, setAreaSearch] = useState("");
  const [filteredAreas, setFilteredAreas] = useState([]);

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

  // 🔹 código compacto
  // const codigo = area && averia && grav ? `${area}-${averia}-${grav}` : null;

  return (
    <Animated.View
      style={{
        //flex: 1,
        padding: 15,
        //backgroundColor: animatedColor,
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
        isOpen={isOpen}
        setOpenId={setOpenId}
        data={filteredAreas}
        selectedValue={area}
        onSelect={(item) => setArea(item.value)}
        placeholder="Seleccionar área"
        searchable
        active={active}
        searchValue={areaSearch}
        onSearchChange={setAreaSearch}
      />

      <Dropdown
        id="averias"
        isOpen={isOpen}
        setOpenId={setOpenId}
        data={averiasDropdown}
        selectedValue={averia}
        onSelect={(item) => setAveria(item.value)}
        active={active}
        placeholder="Seleccionar avería"
      />

      <Dropdown
        id="gravedades"
        isOpen={isOpen}
        setOpenId={setOpenId}
        data={gravedadesDropdown}
        selectedValue={grav}
        active={active}
        onSelect={(item) => setGrav(item.value)}
        placeholder="Seleccionar gravedad"
      />

      {/* 🔥 RESULTADO */}
      {/* {codigo && (
        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {codigo}
          </Text>

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
      )} */}
    </Animated.View>
  );
}
