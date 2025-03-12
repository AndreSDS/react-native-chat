import { StyleSheet, View, Pressable } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LottieAnimation } from "./LottieAnimation";

type Props = {
  stopSpeaking: () => void;
  isSpeeking: boolean;
};

export function AiSpeaking({ stopSpeaking, isSpeeking }: Props) {
  return (
    <View style={styles.container}>
      <LottieAnimation
        loop={isSpeeking}
        source={require("@/assets/animations/bar-animated.json")}
      />
      <Pressable style={styles.stopbutton} onPress={stopSpeaking}>
        <MaterialCommunityIcons
          name="stop-circle-outline"
          size={scale(45)}
          color="#fff"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  stopbutton: {
    zIndex: 1,
    marginTop: verticalScale(-40),
  },
});
