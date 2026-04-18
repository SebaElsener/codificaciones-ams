import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CodigoSection from "../components/CodigoSection";

const tabs = ["AMS", "FORD", "STELLANTIS"];

// JSONs
const areasAMS = require("../utils/areas-ams.json");
const averiasAMS = require("../utils/averias-ams.json");
const gravedadesAMS = require("../utils/gravedades-ams.json");

const areasFord = require("../utils/areas-ford.json");
const averiasFord = require("../utils/averias-ford.json");
const gravedadesFord = require("../utils/gravedades-ford.json");

const areasStellantis = require("../utils/areas-stellantis.json");
const averiasStellantis = require("../utils/averias-stellantis.json");
const gravedadesStellantis = require("../utils/gravedades-stellantis.json");

export default function HomeScreen() {
  const { width } = Dimensions.get("window");

  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);

  // 🔥 fade animación (segura)
  const fade = useRef(new Animated.Value(1)).current;

  const toggleTheme = () => {
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setDark((prev) => !prev);
  };

  return (
    <Animated.View
      style={{
        backgroundColor: dark ? "#121212" : "#f4f0f0",
        opacity: fade,
        paddingTop: 50,
      }}
    >
      {/* 🔘 BOTÓN DARK MODE */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: "absolute",
          right: 15,
          top: 97,
          zIndex: 10,
          backgroundColor: dark ? "#333" : "#fff",
          padding: 10,
          borderRadius: 20,
          elevation: 5,
        }}
      >
        <Text style={{ color: dark ? "#f4f0f0" : "#000" }}>
          {dark ? "☀️" : "🌙"}
        </Text>
      </TouchableOpacity>

      {/* 🧊 HEADER SIMPLE */}
      <View
        style={{
          backgroundColor: dark ? "#121212" : "#fff",
          borderBottomWidth: 0.5,
          borderColor: dark ? "#333" : "#e0e0e0",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {tabs.map((t, i) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setIndex(i);
                scrollRef.current?.scrollTo({ x: i * width, animated: true });
              }}
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: ["#ffcccc", "#ccffcc", "#ccccff"][i],
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: index === i ? (dark ? "#fff" : "#000") : "#888",
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 📦 CONTENIDO */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        contentOffset={{ x: 0, y: 0 }}
        style={{ width: width }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
      >
        <View style={{ width: width, padding: 15 }}>
          <CodigoSection
            title="Códigos AMS"
            areasJson={areasAMS}
            averiasJson={averiasAMS}
            gravedadesJson={gravedadesAMS}
            dark={dark}
          />
        </View>

        <View style={{ width: width, padding: 15 }}>
          <CodigoSection
            title="Códigos Ford"
            areasJson={areasFord}
            averiasJson={averiasFord}
            gravedadesJson={gravedadesFord}
            dark={dark}
          />
        </View>

        <View style={{ width: width, padding: 15 }}>
          <CodigoSection
            title="Códigos Stellantis"
            areasJson={areasStellantis}
            averiasJson={averiasStellantis}
            gravedadesJson={gravedadesStellantis}
            dark={dark}
          />
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
}
