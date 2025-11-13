import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ParticipeScreen from "../screens/ParticipeScreen"
import HomeScreen from "../screens/Home";
import CategoriaScreen from "../screens/CategoriaScreen";
import CreateScreen from "../screens/CreateScreen";
import EditScreen from "../screens/EditScreen";

const Stack = createNativeStackNavigator();
export function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "ConVive (Campo Mourão)" }}
        />
        <Stack.Screen
          name="Categorias"
          component={CategoriaScreen}
          options={{ title: "ConVive (Campo Mourão)" }}
        />
        <Stack.Screen
          name="Participe"
          component={ParticipeScreen}
        />
        <Stack.Screen
          name="Criar"
          component={CreateScreen}
        />
        <Stack.Screen
          name="Editar"
          component={EditScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}