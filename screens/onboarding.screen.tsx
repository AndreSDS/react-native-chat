import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { onBoardingData, onBoardingKeys } from "@/configs/constants";
import { onBoardingDataType } from "@/configs/global";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffSetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(
      contentOffSetX / event.nativeEvent.layoutMeasurement.width
    );

    setActiveIndex(index);
  };

  const handleSkip = async () => {
    const nextIndex = activeIndex + 1;
    const offset = nextIndex * Dimensions.get("window").width;
    if (nextIndex < onBoardingData.length) {
      scrollViewRef.current?.scrollTo({ x: offset, animated: true });
      setActiveIndex(nextIndex);
    } else {
      await AsyncStorage.setItem(onBoardingKeys.isOnboarding, "true");
      router.push("/(routes)/home");
    }
  };

  return (
    <LinearGradient
      colors={["#250152", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.conntainer}
    >
      <StatusBar translucent barStyle="light-content" />

      <Pressable style={styles.header} onPress={handleSkip}>
        <Text style={styles.headerTitle}>Skip</Text>
        <Feather
          name="arrow-right"
          style={{
            marginBottom: scale(-5),
          }}
          size={scale(18)}
          color="#fff"
        />
      </Pressable>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        onScroll={handleScroll}
        ref={scrollViewRef}
      >
        {onBoardingData.map((item: onBoardingDataType, index) => (
          <View key={index} style={styles.slide}>
            {item.image}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {onBoardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === activeIndex ? "#fff" : "#ADADAD",
                width: index === activeIndex ? scale(10) : scale(8),
                height: index === activeIndex ? scale(10) : scale(8),
                opacity: index === activeIndex ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  conntainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: verticalScale(50),
    right: scale(20),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "RobotoSemiBold",
    fontSize: scale(17),
    fontWeight: "semibold",
  },
  slide: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontFamily: "RobotoSemiBold",
    fontSize: scale(25),
    fontWeight: "semibold",
    textAlign: "center",
    marginBottom: 16,
    width: scale(290),
    marginHorizontal: "auto",
  },
  subTitle: {
    color: "#9A9999",
    fontFamily: "RobotoRegular",
    fontSize: scale(16),
    marginBottom: 32,
    width: scale(290),
    textAlign: "center",
    marginHorizontal: "auto",
  },
  pagination: {
    position: "absolute",
    bottom: verticalScale(70),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(10),
  },
  paginationDot: {
    borderRadius: 100,
  },
});
