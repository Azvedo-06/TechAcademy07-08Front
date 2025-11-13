import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QuadroParticipacao from "../components/UserInserts"

export default function ParticipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participe!</Text>

      <View style={styles.content}>
        <QuadroParticipacao />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",     
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});