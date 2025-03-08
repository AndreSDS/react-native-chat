import { onBoardingKeys } from "@/configs/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function index() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      const isOnboarding = await AsyncStorage.getItem(
        onBoardingKeys.isOnboarding
      );
      if (isOnboarding !== null) {
        setIsOnboarding(false);
      }
      setIsLoading(false);
    }
    checkOnboarding();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Redirect href={isOnboarding ? "/(routes)/onboarding" : "/(routes)/home"} />
  );
}
