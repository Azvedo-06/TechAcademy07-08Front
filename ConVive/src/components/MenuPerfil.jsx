import React, { use } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

export default function MenuPerfil({ visible, user, onLogout, onClose }) {

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <Text style={styles.title}>Perfil</Text>

          <Text style={styles.text}>Nome: {user?.name}</Text>
          <Text style={styles.text}>Email: {user?.email}</Text>
          
          <Text style={styles.text}>Tipo de conta: {user.isAdmin ? "Administrador" : "Usuário comum"}</Text>

          <TouchableOpacity style={styles.logout} onPress={onLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    width: "80%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  logout: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  close: {
    marginTop: 10,
  },
  closeText: {
    textAlign: "center",
    fontSize: 16,
  },
});