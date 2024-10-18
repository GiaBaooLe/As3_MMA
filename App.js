import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./components/HomeScreen";
import FavoritesScreen from "./components/FavoriteScreen";
import DetailScreen from "./components/DetailScreen";
import { FavoritesProvider } from "./components/FavoritesContext";
import Header from "./components/Header";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    
    <FavoritesProvider>
    <Header/>
      <NavigationContainer>
        <Tab.Navigator
        
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Favorites") {
                iconName = "heart";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" component={HomeStack}  options={{ headerShown: false }}    />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
   
    </FavoritesProvider>

  );
};

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}   />
    <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Detail" }}  />
  </Stack.Navigator>
);

export default App;
