import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import CodigoSection from "../components/CodigoSection";

import * as Font from "expo-font";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Card from "../components/Card";
import { usePortal } from "../components/Portal";

const { width, height } = Dimensions.get("window");

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
  const [active, setActive] = useState(null);
  const [openId, setOpenId] = useState(null);
  const { clear } = usePortal();

  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(1);

  const positions = [
    { top: 120, left: 40, rotate: -8 },
    { top: 220, left: 90, rotate: 6 },
    { top: 340, left: 50, rotate: 10 },
  ];

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Hand: require("../assets/fonts/PatrickHand-Regular.ttf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  const close = () => {
    clear();
    progress.value = withTiming(0, {}, (finished) => {
      if (finished) runOnJS(setActive)(null);
    });
  };

  const renderContent = (i, setOpenId) => {
    switch (i) {
      case 0:
        return (
          <CodigoSection
            title="Códigos AMS"
            areasJson={areasAMS}
            averiasJson={averiasAMS}
            gravedadesJson={gravedadesAMS}
            isOpen={openId}
            setOpenId={setOpenId}
            active={active}
          />
        );
      case 1:
        return (
          <CodigoSection
            title="Códigos Ford"
            areasJson={areasFord}
            averiasJson={averiasFord}
            gravedadesJson={gravedadesFord}
            isOpen={openId}
            setOpenId={setOpenId}
            active={active}
          />
        );
      case 2:
        return (
          <CodigoSection
            title="Códigos Stellantis"
            areasJson={areasStellantis}
            averiasJson={averiasStellantis}
            gravedadesJson={gravedadesStellantis}
            isOpen={openId}
            setOpenId={setOpenId}
            active={active}
          />
        );
    }
  };

  return (
    <View
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
        setContainerHeight(e.nativeEvent.layout.height);
      }}
      style={{ flex: 1, backgroundColor: "#d9d488" }}
    >
      {/* 👇 OVERLAY CLICKEABLE */}
      {active !== null && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={close}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View style={{ flex: 1, opacity: progress }}>
            <BlurView intensity={80} style={{ flex: 1 }} />
          </Animated.View>
        </TouchableOpacity>
      )}

      {tabs.map((t, i) => (
        <Card
          key={t}
          i={i}
          t={t}
          pos={positions[i]}
          active={active}
          setActive={setActive}
          setOpenId={setOpenId}
          progress={progress}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          renderContent={renderContent}
          close={close}
          width={width}
          height={height}
          styles={styles}
          fadeIn={fadeIn}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#f5ecd9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
    overflow: "hidden",
  },
  texture: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.88,
  },
  title: {
    fontSize: 18,
    fontFamily: "Hand",
  },
  line: (i) => ({
    height: 1,
    backgroundColor: "#d6d3c9",
    marginTop: 10,
    width: `${80 - i * 10}%`,
  }),
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
