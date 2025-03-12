import { StyleSheet, View, Pressable } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  isRecording: boolean;
  startRecording: () => void;
  startSpeaking: () => void;
};

export function Controls({
  isRecording,
  startRecording,
  startSpeaking,
}: Props) {
  return (
    <View style={styles.controls}>
      <Pressable
        style={{ zIndex: 1 }}
        onPress={startSpeaking}
        disabled={isRecording}
      >
        <MaterialCommunityIcons
          name="motion-play-outline"
          size={scale(45)}
          color="#fff"
        />
      </Pressable>

      <Pressable
        style={{ zIndex: 1 }}
        onPress={startRecording}
        disabled={isRecording}
      >
        <Ionicons name="mic-circle-outline" size={scale(45)} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
});
