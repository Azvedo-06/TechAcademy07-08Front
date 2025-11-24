import React from "react";
import Register from "../components/RegisterInserts.jsx"

import { Text, StyleSheet, View } from "react-native";
export default function RegisterScreen() {
  return (
    <View style={style.container}>
      <Text styles={style.title}>Registre-se!!</Text>
      <Register />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});