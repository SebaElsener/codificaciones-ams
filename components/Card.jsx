import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Card({
  i,
  t,
  pos,
  active,
  setActive,
  setOpenId,
  progress,
  containerWidth,
  containerHeight,
  renderContent,
  close,
  width,
  height,
  styles,
}) {
  const isActive = active === i;
  const pressScale = useSharedValue(1);

  // estilo del card (igual que antes, pero opacity siempre 1)
  const style = useAnimatedStyle(() => {
    // 👇 cards en reposo: quietas en el mazo, sin progress
    if (!isActive) {
      return {
        position: "absolute",
        width: 240,
        height: 170,
        transform: [
          { translateX: pos.left },
          { translateY: pos.top },
          { scale: pressScale.value },
          { rotate: `${pos.rotate}deg` },
        ],
        zIndex: i,
        opacity: 1,
      };
    }

    // 👇 solo la activa anima con progress (incluido el arco)
    const CARD_WIDTH = width * 0.85;
    const CARD_HEIGHT = height * 0.43;
    const centerX = containerWidth / 2 - CARD_WIDTH / 2;
    const centerY = containerHeight / 2 - CARD_HEIGHT / 2;

    const translateX = interpolate(progress.value, [0, 1], [pos.left, centerX]);

    const baseY = interpolate(progress.value, [0, 1], [pos.top, centerY]);
    const arc = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, -90, -120, -90, 0],
    );
    const translateY = baseY + arc;

    const baseScale = interpolate(progress.value, [0, 1], [1, 1.02]);
    const finalScale = baseScale * pressScale.value;
    const rotate = `${interpolate(progress.value, [0, 1], [pos.rotate, 0])}deg`;
    const w = interpolate(progress.value, [0, 1], [240, CARD_WIDTH]);
    const h = interpolate(progress.value, [0, 1], [170, CARD_HEIGHT]);

    return {
      position: "absolute",
      width: w,
      height: h,
      transform: [
        { translateX },
        { translateY },
        { scale: finalScale },
        { rotate },
      ],
      zIndex: progress.value > 0.35 ? 100 : i,
      opacity: 1,
    };
  });

  // 👇 cross-fade: el contenido "rest" se ve cuando progress es bajo,
  //                el contenido "abierto" cuando progress es alto.
  // Para las cards no activas, opacity siempre 1 (no las queremos esconder).
  const restStyle = useAnimatedStyle(() => ({
    opacity: isActive ? 1 - progress.value : 1,
  }));

  const openStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[styles.card, style]}>
      <Image
        source={require("../assets/images/paper-texture.png")}
        style={styles.texture}
        resizeMode="cover"
      />

      <TouchableOpacity
        activeOpacity={1}
        disabled={isActive}
        onPressIn={() => {
          pressScale.value = withTiming(0.96, { duration: 80 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1);
        }}
        onPress={() => {
          progress.value = 0;
          setActive(i);
          requestAnimationFrame(() => {
            progress.value = withSpring(1);
          });
        }}
        style={{ flex: 1 }}
      >
        <View style={styles.inner}>
          {/* Contenido en reposo: título + líneas. Siempre montado. */}
          <Animated.View
            pointerEvents={isActive ? "none" : "auto"}
            style={restStyle}
          >
            <Text style={styles.title}>{t}</Text>
            {[...Array(4)].map((_, j) => (
              <View key={j} style={styles.line(j)} />
            ))}
          </Animated.View>

          {/* Contenido abierto: solo se monta si está activa, overlay absoluto */}
          {isActive && (
            <Animated.View
              style={[StyleSheet.absoluteFill, { padding: 16 }, openStyle]}
            >
              <TouchableOpacity onPress={close} style={styles.close}>
                <Text>✕</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, marginTop: 30 }}>
                {renderContent(i, setOpenId)}
              </View>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
