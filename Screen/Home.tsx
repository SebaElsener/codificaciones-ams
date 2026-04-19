import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
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
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);

  // 🔥 fade animación (segura)
  const fade = useRef(new Animated.Value(1)).current;

  // 🎨 COLOR BASE
  const baseColors = ["#c96565", "#30cb30", "#2a2ad6"];

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

  if (!containerWidth) return null;

  return (
    <Animated.View
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
      style={{
        backgroundColor: dark ? "#121212" : "#ffffff00",
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
          backgroundColor: dark ? "#121212" : "#ffffff00",
          // borderBottomWidth: 0,
          // borderColor: dark ? "#333" : "#e0e0e0",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {tabs.map((t, i) => {
            const inputRange = [
              (i - 1) * containerWidth,
              i * containerWidth,
              (i + 1) * containerWidth,
            ];

            // 🎯 TAB SUBE / BAJA
            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [6, 0, 6],
              extrapolate: "clamp",
            });

            // 🎨 MEZCLA DE COLOR (se vuelve más “fuerte” cuando está activa)
            const backgroundColor = scrollX.interpolate({
              inputRange,
              outputRange: [
                baseColors[i] + "88", // transparente
                baseColors[i], // sólido
                baseColors[i] + "88",
              ],
              extrapolate: "clamp",
            });

            // 🔤 TEXTO
            const textColor = scrollX.interpolate({
              inputRange,
              outputRange: ["#888", dark ? "#fff" : "#000", "#888"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={t}
                style={{
                  flex: 1,
                  transform: [{ translateY }],
                  zIndex: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIndex(i);
                    scrollRef.current?.scrollTo({
                      x: i * containerWidth,
                      animated: true,
                    });
                  }}
                  activeOpacity={0.8}
                  style={{
                    alignItems: "center",
                    paddingVertical: 12,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Animated.View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor,
                    }}
                  />

                  <Animated.Text
                    style={{
                      fontWeight: "700",
                      color: textColor,
                    }}
                  >
                    {t}
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* 📦 CONTENIDO */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        contentOffset={{ x: 0, y: 0 }}
        style={{ width: containerWidth }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / containerWidth,
          );
          setIndex(newIndex);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
      >
        <View
          style={{
            width: containerWidth,
            //marginTop: 15,
            backgroundColor: dark ? "#121212" : "#ffffff00",
          }}
        >
          <CodigoSection
            title="Códigos AMS"
            areasJson={areasAMS}
            averiasJson={averiasAMS}
            gravedadesJson={gravedadesAMS}
            dark={dark}
            active={index === 0}
            baseColors={baseColors}
            scrollX={scrollX}
            pageIndex={0}
          />
        </View>

        <View
          style={{
            width: containerWidth,
            backgroundColor: dark ? "#121212" : "#fff",
          }}
        >
          <CodigoSection
            title="Códigos Ford"
            areasJson={areasFord}
            averiasJson={averiasFord}
            gravedadesJson={gravedadesFord}
            dark={dark}
            active={index === 1}
            baseColors={baseColors}
            scrollX={scrollX}
            pageIndex={1}
          />
        </View>

        <View
          style={{
            width: containerWidth,
            //padding: 15,
            backgroundColor: dark ? "#121212" : "#fff",
          }}
        >
          <CodigoSection
            title="Códigos Stellantis"
            areasJson={areasStellantis}
            averiasJson={averiasStellantis}
            gravedadesJson={gravedadesStellantis}
            dark={dark}
            active={index === 2}
            baseColors={baseColors}
            scrollX={scrollX}
            pageIndex={2}
          />
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
}
