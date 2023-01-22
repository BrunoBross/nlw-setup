import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

import { Home } from "../screens/Home";
import { Habit } from "../screens/Habit";
import { New } from "../screens/New";

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Screen name="home" component={Home} />
      <Screen name="habit" component={Habit} />
      <Screen name="new" component={New} />
    </Navigator>
  );
}
