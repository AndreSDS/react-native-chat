import { onBoardingData } from "@/configs/constants";
import { onBoardingDataType } from "@/configs/global";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { scale } from "react-native-size-matters";

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

  return (
    <LinearGradient
      colors={["#250152", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.conntainer}
    >
      <StatusBar translucent barStyle="light-content" />

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        onScroll={handleScroll}
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
                backgroundColor:
                  index === activeIndex ? "#fff" : "rgba(255, 255, 255, 0.5)",
                width: index === activeIndex ? scale(10) : scale(8),
                height: index === activeIndex ? scale(10) : scale(8),
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    borderRadius: "50%",
    marginHorizontal: scale(5),
    backgroundColor: "#fff",
    opacity: 0.5,
  },
});
