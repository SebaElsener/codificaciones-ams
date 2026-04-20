import { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import CodigoSection from "../components/CodigoSection";

const tabs = ["AMS", "FORD", "STELLANTIS"];

const baseColors = ["#f04646", "#51ca51", "#4343d5"];

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

  const translateY = useRef(new Animated.Value(-6)).current;

  const soften = (hex, amount = 0.7) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const mix = (c) => Math.round(c + (255 - c) * amount);

    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  };
  const handlePageChange = (i) => {
    setIndex(i);

    translateY.setValue(0); // 👈 bajar primero

    Animated.spring(translateY, {
      toValue: -6,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  };

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
        <View style={{ flexDirection: "row" }}>
          {tabs.map((t, i) => {
            const isActive = index === i;

            return (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setIndex(i);
                  pagerRef.current?.setPage(i);
                  handlePageChange(i);
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
                  // transform: [{ translateY: isActive ? -6 : 0 }],
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: isActive ? "#000" : "#555",
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
            top: 90, // ajustá según tu layout
            left: `${(100 / tabs.length) * index}%`,
            width: `${100 / tabs.length}%`,
            transform: [{ translateY }],
            zIndex: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingVertical: 12,
              backgroundColor: baseColors[index],
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "700" }}>{tabs[index]}</Text>
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
              // transform: [{ translateY: -6 }]
            }}
            initialPage={0}
            onPageSelected={(e) => {
              handlePageChange(e.nativeEvent.position);
            }}
          >
            <View key="0" style={{ flex: 1 }}>
              <Animated.View
                style={{
                  flex: 1,
                  // transform: [{ translateY: index === 0 ? -6 : 0 }],
                }}
              >
                <CodigoSection
                  title="Códigos AMS"
                  areasJson={areasAMS}
                  averiasJson={averiasAMS}
                  gravedadesJson={gravedadesAMS}
                  active={index === 0}
                  baseColor={baseColors[0]}
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
                  // transform: [{ translateY: index === 1 ? -6 : 0 }],
                }}
              >
                <CodigoSection
                  title="Códigos Ford"
                  areasJson={areasFord}
                  averiasJson={averiasFord}
                  gravedadesJson={gravedadesFord}
                  active={index === 1}
                  baseColor={baseColors[1]}
                />
              </Animated.View>
            </View>

            <View key="2" style={{ flex: 1 }}>
              <Animated.View
                style={{
                  flex: 1,
                  // transform: [{ translateY: index === 2 ? -6 : 0 }],
                }}
              >
                <CodigoSection
                  title="Códigos Stellantis"
                  areasJson={areasStellantis}
                  averiasJson={averiasStellantis}
                  gravedadesJson={gravedadesStellantis}
                  active={index === 2}
                  baseColor={baseColors[2]}
                />
              </Animated.View>
            </View>
          </PagerView>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
