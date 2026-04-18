import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import CodigoSection from "../components/CodigoSection";

//const { containerWidth } = Dimensions.get("window");

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
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);

  // 🔥 fade animación (segura)
  const fade = useRef(new Animated.Value(1)).current;

  const [containerWidth, setContainerWidth] = useState(0);
  const tabWidth = containerWidth / tabs.length;

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

  // 🔥 animación tabs
  const scaleAnims = useRef(tabs.map(() => new Animated.Value(1))).current;

  const animateTab = (i) => {
    scaleAnims.forEach((anim, idx) => {
      Animated.spring(anim, {
        toValue: idx === i ? 1.1 : 1,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToTab = (i) => {
    setIndex(i);
    animateTab(i);
    Haptics.selectionAsync();

    scrollRef.current?.scrollTo({ x: i * containerWidth, animated: true });
  };

  // 🔵 indicador
  const indicatorTranslateX = scrollX.interpolate({
    inputRange: [0, containerWidth * (tabs.length - 1)],
    outputRange: [0, tabWidth * (tabs.length - 1)],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: dark ? "#121212" : "#f4f0f0",
        opacity: fade,
        top: 50,
      }}
    >
      {/* 🔘 BOTÓN DARK MODE */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: "absolute",
          right: 15,
          top: 50,
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

      {/* 🧊 HEADER */}
      <BlurView
        intensity={100}
        tint={dark ? "dark" : "light"}
        style={{
          backgroundColor: dark ? "rgba(20,20,20,0.8)" : "#f4f0f0cc",
          paddingTop: 12,
          paddingBottom: 10,
          borderBottomWidth: 0.8,
          borderColor: dark ? "#333" : "#e0e0e0",
        }}
      >
        <View
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width);
          }}
          style={{ flexDirection: "row" }}
        >
          {tabs.map((t, i) => {
            const active = index === i;

            return (
              <TouchableOpacity
                key={t}
                onPress={() => goToTab(i)}
                style={{
                  width: tabWidth,
                  alignItems: "center",
                  paddingVertical: 6,
                }}
              >
                <Animated.Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    transform: [{ scale: scaleAnims[i] }],
                    color: active ? (dark ? "#ffffff" : "#2b2b2b") : "#9e9e9e",
                  }}
                >
                  {t}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🔵 indicador */}
        <View style={{ height: 3, marginTop: 6 }}>
          <Animated.View
            style={{
              position: "absolute",
              height: 3,
              width: tabWidth * 0.4,
              backgroundColor: "#54bca2",
              borderRadius: 2,
              left: tabWidth * 0.3,
              transform: [{ translateX: indicatorTranslateX }],
            }}
          />
        </View>
      </BlurView>

      {/* 📦 CONTENIDO */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / containerWidth,
          );
          setIndex(newIndex);
          animateTab(newIndex);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
      >
        <View style={{ padding: 15 }}>
          <CodigoSection
            title="Códigos AMS"
            areasJson={areasAMS}
            averiasJson={averiasAMS}
            gravedadesJson={gravedadesAMS}
            dark={dark}
          />
        </View>

        <View style={{ padding: 15 }}>
          <CodigoSection
            title="Códigos Ford"
            areasJson={areasFord}
            averiasJson={averiasFord}
            gravedadesJson={gravedadesFord}
            dark={dark}
          />
        </View>

        <View style={{ padding: 15 }}>
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
