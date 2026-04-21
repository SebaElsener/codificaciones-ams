import { useEffect, useMemo, useState } from "react";
import { Animated, Text } from "react-native";
import Dropdown from "./Dropdown";

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

  // 🔹 memoizamos (evita recalcular siempre)
  const areasDropdown = useMemo(
    () =>
      areasJson.map((p) => ({
        label: p.descripcion,
        value: p.id,
      })),
    [areasJson],
  );

  const averiasDropdown = useMemo(
    () =>
      averiasJson.map((p) => ({
        label: p.descripcion,
        value: p.id,
      })),
    [averiasJson],
  );

  const gravedadesDropdown = useMemo(
    () =>
      gravedadesJson.map((p) => ({
        label: p.descripcion,
        value: p.id,
      })),
    [gravedadesJson],
  );

  // 🔹 filtro SIN estado extra
  const filteredAreas = useMemo(() => {
    if (!areaSearch) return areasDropdown;

    return areasDropdown.filter((item) =>
      item.label.toLowerCase().includes(areaSearch.toLowerCase()),
    );
  }, [areaSearch, areasDropdown]);

  // 🔹 reset cuando se cierra la card
  useEffect(() => {
    if (active === null) {
      setArea("");
      setAveria("");
      setGrav("");
      setAreaSearch("");
    }
  }, [active]);

  return (
    <Animated.View style={{ padding: 15 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
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
        placeholder="Seleccionar avería"
      />

      <Dropdown
        id="gravedades"
        isOpen={isOpen}
        setOpenId={setOpenId}
        data={gravedadesDropdown}
        selectedValue={grav}
        onSelect={(item) => setGrav(item.value)}
        placeholder="Seleccionar gravedad"
      />
    </Animated.View>
  );
}
