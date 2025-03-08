import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { OnboardingScreen } from "@/screens/onboarding.screen";

export default function Onboarding() {
  const [isOnboarding, setIsOnboarding] = useState(true);

  useEffect(() => {
    setIsOnboarding(false);
  }, []);

  return <OnboardingScreen />;
}
