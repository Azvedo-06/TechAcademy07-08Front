import React from "react";
import {Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Card({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card } onPress={onPress}>
      <Text style={styles.cardText}>{item.title}</Text>
      {item.local ? <Text style={styles.cardDesc}>Local: {item.spaceId.name}</Text> : null}
      {item.date ? <Text style={styles.cardDesc}>Data: {item.date}</Text> : null}
      {item.descriptionCard ? <Text style={styles.cardDesc}>{item.descriptionCard}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
  },
  cardText: {
    fontSize: 18,
  },
  cardDesc: {
    fontSize: 13,
    marginTop: 6,
    color: "#333",
  },
});
