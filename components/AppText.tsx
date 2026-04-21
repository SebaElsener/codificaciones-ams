// components/AppText.tsx
import { Text as RNText, TextProps } from "react-native";

export default function AppText({ style, ...rest }: TextProps) {
  return <RNText {...rest} style={[{ fontFamily: "Hand" }, style]} />;
}
