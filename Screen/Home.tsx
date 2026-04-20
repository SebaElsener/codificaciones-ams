import { useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import CodigoSection from "../components/CodigoSection";

const tabs = ["AMS", "FORD", "STELLANTIS"];

const baseColors = ["#b93131", "#2cba2c", "#4343d5"];

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
  const pagerRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const translateY = useRef(new Animated.Value(-6)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const tabWidth = containerWidth / tabs.length;
  const [isDragging, setIsDragging] = useState(false);

  const soften = (hex, amount = 0.7) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const mix = (c) => Math.round(c + (255 - c) * amount);

    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  };

  const animateTab = (i) => {
    // movimiento horizontal suave
    Animated.timing(translateX, {
      toValue: i * tabWidth,
      duration: 220,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();

    // rebote vertical tipo iOS
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: -8,
        tension: 90,
        friction: 14,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const sharedColor = translateX.interpolate({
    inputRange: tabs.map((_, i) => i * tabWidth),
    outputRange: baseColors,
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          paddingTop: 90,
        }}
      >
        {/* 🧊 HEADER */}
        <View
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width);
          }}
          style={{ flexDirection: "row" }}
        >
          {tabs.map((t, i) => {
            const isActive = index === i;

            return (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setIndex(i);
                  pagerRef.current?.setPage(i);
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 12,
                  backgroundColor: isActive
                    ? baseColors[i]
                    : soften(baseColors[i], 0.7),
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: isActive ? "#f5f3f3" : "#aca6a6",
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Animated.View
          style={{
            position: "absolute",
            top: 90,
            width: tabWidth,
            transform: [{ translateX }, { translateY }],
            zIndex: 20,
            elevation: 20,
            backgroundColor: sharedColor,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingVertical: 12,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "700", color: "#f3efef" }}>
              {tabs[index]}
            </Text>
          </View>
        </Animated.View>

        {/* 📦 PAGER */}
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY }],
          }}
        >
          <PagerView
            ref={pagerRef}
            style={{
              flex: 1,
            }}
            initialPage={0}
            onPageSelected={(e) => {
              const i = e.nativeEvent.position;
              setIndex(i);
              animateTab(i);
            }}
            onPageScrollStateChanged={(e) => {
              const state = e.nativeEvent.pageScrollState;
              setIsDragging(state !== "idle");
            }}
          >
            <View key="0" style={{ flex: 1 }}>
              <Animated.View
                style={{
                  flex: 1,
                }}
              >
                <CodigoSection
                  title="Códigos AMS"
                  areasJson={areasAMS}
                  averiasJson={averiasAMS}
                  gravedadesJson={gravedadesAMS}
                  active={index === 0}
                  animatedColor={sharedColor}
                  isDragging={isDragging}
                />
              </Animated.View>
            </View>

            <View
              key="1"
              style={{
                flex: 1,
              }}
            >
              <Animated.View
                style={{
                  flex: 1,
                }}
              >
                <CodigoSection
                  title="Códigos Ford"
                  areasJson={areasFord}
                  averiasJson={averiasFord}
                  gravedadesJson={gravedadesFord}
                  active={index === 1}
                  animatedColor={sharedColor}
                  isDragging={isDragging}
                />
              </Animated.View>
            </View>

            <View key="2" style={{ flex: 1 }}>
              <Animated.View
                style={{
                  flex: 1,
                }}
              >
                <CodigoSection
                  title="Códigos Stellantis"
                  areasJson={areasStellantis}
                  averiasJson={averiasStellantis}
                  gravedadesJson={gravedadesStellantis}
                  active={index === 2}
                  animatedColor={sharedColor}
                  isDragging={isDragging}
                />
              </Animated.View>
            </View>
          </PagerView>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
