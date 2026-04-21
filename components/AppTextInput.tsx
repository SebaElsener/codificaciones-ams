// components/AppTextInput.tsx
import { TextInput as RNTextInput, TextInputProps } from "react-native";

export default function AppTextInput({ style, ...rest }: TextInputProps) {
  return <RNTextInput {...rest} style={[{ fontFamily: "Hand" }, style]} />;
}
