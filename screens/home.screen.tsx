import { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import { useMutation } from "@tanstack/react-query";
import { textToSpeech, transcription } from "@/lib/geminiClient";
import * as Speech from "expo-speech";
import { Microphone } from "@/components/Microphone";
import { LottieAnimation } from "@/components/LottieAnimation";
import { AiSpeaking } from "@/components/AiSpeaking";
import { Controls } from "@/components/Controls";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioMessage, setAudioMessage] = useState<Audio.Recording>();
  const [isSpeeking, setIsSpeking] = useState(false);

  const {
    isPending,
    data: questionText,
    mutateAsync: sendAudioToWhisper,
  } = useMutation({
    mutationFn: async (audioUri: string) => await transcription(audioUri),
    onSuccess: async ({ response }) => await getApiResponse(response),
    onError: (error) => {
      console.error("Failed to transcribe audio: ", error);
      Alert.alert("Error", "Failed to transcribe audio.");
    },
  });

  const {
    isPending: isLoadingApiResponse,
    data: apiResponse,
    mutateAsync: getApiResponse,
    isSuccess: isSuccessApiResponse,
  } = useMutation({
    mutationFn: async (text: string) => await textToSpeech(text),
    onSuccess: (response) => speakingText(response),
    onError: (error) => {
      console.error("Failed to generate speech audio: ", error);
      Alert.alert("Error", "Failed to generate speech audio.");
    },
  });

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

  async function startRecording() {
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
      audioMessage?.stopAndUnloadAsync();
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch {
      console.log("Error");
    }
  }

  async function handleMessage() {
    try {
      await stopRecording();

      const uri = audioMessage?.getURI();

      if (!uri) {
        console.error("URI is undefined");
        return;
      }

      await sendAudioToWhisper(uri);
    } catch {
      console.log("Error");
    }
  }

  function speakingText(text: string) {
    if (!text) {
      return;
    }

    Speech.speak(text, {
      language: "pt-BR",
      rate: 1,
      onStart: () => setIsSpeking(true),
      onDone: () => setIsSpeking(false),
    });
  }

  function stopSpeaking() {
    Speech.stop();
    setIsSpeking(false);
  }

  return (
    <LinearGradient
      colors={["#250152", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.conntainer}
    >
      <StatusBar translucent barStyle={"light-content"} />

      <TouchableOpacity style={styles.backArrow} onPress={stopRecording}>
        <MaterialIcons name="arrow-back-ios" size={scale(20)} color="#fff" />
      </TouchableOpacity>

      <Image source={require("@/assets/main/blur.png")} style={styles.blur1} />

      {isSuccessApiResponse && !isRecording ? (
        <AiSpeaking stopSpeaking={stopSpeaking} isSpeeking={isSpeeking} />
      ) : isPending || isLoadingApiResponse ? (
        <LottieAnimation
          loop
          source={require("@/assets/animations/loading-animated.json")}
        />
      ) : (
        <Microphone
          isRecording={isRecording}
          stopRecording={handleMessage}
          startRecording={startRecording}
        />
      )}

      <Image
        source={require("@/assets/main/purple-blur.png")}
        style={styles.blur2}
      />

      <View style={styles.footer}>
        <Text style={styles.message}>
          {isPending
            ? ""
            : questionText?.response ||
              "Press the microfone to start recording!"}
        </Text>
      </View>

      {isSuccessApiResponse && (
        <Controls
          isRecording={isRecording}
          startRecording={startRecording}
          startSpeaking={() => speakingText(apiResponse)}
        />
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
  backArrow: {
    position: "absolute",
    top: verticalScale(50),
    left: scale(20),
  },
  blur1: {
    position: "absolute",
    top: verticalScale(50),
    right: scale(0),
    width: scale(240),
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
});
