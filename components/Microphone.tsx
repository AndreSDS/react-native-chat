import { TouchableOpacity, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { FontAwesome } from "@expo/vector-icons";
import { LottieAnimation } from "./LottieAnimation";

type Props = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

export function Microphone({
  isRecording,
  startRecording,
  stopRecording,
}: Props) {
  return (
    <>
      {isRecording ? (
        <TouchableOpacity
          style={{
            zIndex: 1,
          }}
          onPress={stopRecording}
        >
          <LottieAnimation
            loop
            source={require("@/assets/animations/mic-pulse.json")}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.microphone} onPress={startRecording}>
          <FontAwesome name="microphone" size={scale(50)} color="#2b3356" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  microphone: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(100),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
