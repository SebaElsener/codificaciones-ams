import { Image, Text, TouchableOpacity, View } from "react-native";
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

  const style = useAnimatedStyle(() => {
    const CARD_WIDTH = width * 0.85;
    const CARD_HEIGHT = height * 0.43;

    const centerX = containerWidth / 2 - CARD_WIDTH / 2;
    const centerY = containerHeight / 2 - CARD_HEIGHT / 2;

    const translateX = interpolate(progress.value, [0, 1], [pos.left, centerX]);
    const translateY = interpolate(progress.value, [0, 1], [pos.top, centerY]);
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
      zIndex: isActive ? 100 : i,
      opacity: isActive
        ? interpolate(progress.value, [0, 0.01, 1], [0, 1, 1])
        : 1,
    };
  });

  return (
    <Animated.View style={[styles.card, style]}>
      <Image
        source={require("../assets/images/paper-texture.png")}
        style={styles.texture}
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
          {!isActive && (
            <>
              <Text style={styles.title}>{t}</Text>
              {[...Array(4)].map((_, j) => (
                <View key={j} style={styles.line(j)} />
              ))}
            </>
          )}

          {isActive && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={close} style={styles.close}>
                <Text>✕</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, marginTop: 30 }}>
                {renderContent(i, setOpenId)}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
