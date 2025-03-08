import { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export function HomeScreen() {
  const [textMessage, setTextMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [AIresponse, setAIResponse] = useState(false);
  const [audioMessage, setAudioMessage] = useState<Audio.Recording>();

  async function getMicPermissions() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Permission",
          "Permission to access the microphone is required!"
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to get microphone permissions: ", error);
      return false;
    }
  }

  const recordOptions: Audio.RecordingOptions = {
    android: {
      extension: ".wav",
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {} as any,
  };

  async function starRecording() {
    setIsRecording(true);

    const hasPermission = await getMicPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(recordOptions);

      setAudioMessage(recording);
    } catch (error) {
      console.error("Failed to start recording: ", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    setAudioMessage(undefined);
    try {
      await audioMessage?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = audioMessage?.getURI();

      if (!uri) {
        console.error("URI is undefined");
        return;
      }

      // implementar o gemini aqui
      // e remover o playback
      const { sound } = await Audio.Sound.createAsync({ uri });

      await sound.playAsync();
    } catch {
      console.log("Error");
    }
  }


  return (
    <LinearGradient
      colors={["#250152", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.conntainer}
    >
      <StatusBar translucent barStyle={"light-content"} />
      <Image source={require("@/assets/main/blur.png")} style={styles.blur1} />

      <TouchableOpacity
        style={styles.microphone}
        onPress={audioMessage ? stopRecording : starRecording}
      >
        {isRecording ? (
          <FontAwesome5 name="stop" size={scale(50)} color="#2b3356" />
        ) : (
          <FontAwesome name="microphone" size={scale(50)} color="#2b3356" />
        )}
      </TouchableOpacity>

      <Image
        source={require("@/assets/main/purple-blur.png")}
        style={styles.blur2}
      />

      <View style={styles.footer}>
        <Text style={styles.message}>
          Press the microfone to start recording!
        </Text>
      </View>

      {!AIresponse && (
        <View style={styles.controls}>
          <Pressable
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              zIndex: 1,
            }}
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="motion-play-outline"
              size={scale(45)}
              color="#fff"
            />
          </Pressable>

          <Pressable
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              zIndex: 1,
            }}
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="motion-play-outline"
              size={scale(45)}
              color="#fff"
            />
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  conntainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blur1: {
    position: "absolute",
    top: verticalScale(50),
    right: scale(0),
    width: scale(240),
  },
  microphone: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(100),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  blur2: {
    position: "absolute",
    bottom: verticalScale(100),
    left: scale(0),
    width: scale(210),
  },
  footer: {
    alignItems: "center",
    width: scale(350),
    position: "absolute",
    bottom: verticalScale(100),
  },
  message: {
    color: "#fff",
    fontFamily: "RobotoRegular",
    fontSize: scale(16),
    lineHeight: scale(25),
    fontWeight: "regular",
    textAlign: "center",
    width: scale(260),
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
});
