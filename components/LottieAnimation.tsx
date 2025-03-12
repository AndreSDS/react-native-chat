import { scale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof LottieView>;

export function LottieAnimation({ source, loop, ...rest }: Props) {
  return (
    <LottieView
      source={source}
      autoPlay
      loop={loop}
      speed={1.3}
      {...rest}
      style={{
        width: scale(250),
        height: scale(250),
        alignSelf: "center",
      }}
    />
  );
}
