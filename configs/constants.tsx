import { Onboarding1 } from "@/assets/svgs/onboarding1";
import { onBoardingDataType } from "./global";
import { Onboarding2 } from "@/assets/svgs/onboarding2";
import { Onboarding3 } from "@/assets/svgs/onboarding3";

export const onBoardingData: onBoardingDataType[] = [
  {
    id: 1,
    title: "Welcome to the App",
    subTitle: "This is the first screen of the onboarding process.",
    image: <Onboarding1 />,
  },
  {
    id: 2,
    title: "Welcome to the App",
    subTitle: "This is the Second screen of the onboarding process.",
    image: <Onboarding2 />,
  },
  {
    id: 3,
    title: "Welcome to the App",
    subTitle: "This is the Third screen of the onboarding process.",
    image: <Onboarding3 />,
  },
];

export const onBoardingKeys = {
  isOnboarding: "isOnboarding",
};
