import React from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  deleteEvent,
  deleteInformativos,
  deleteAtividades,
  deleteSpaces,
} from "../data/api";

export default function ModalCard({
  modalVisible,
  setModalVisible,
  selectedItem,
  tipo,
  onRefresh,
}) {
  const navigation = useNavigation();

  async function handleDelete() {
  const showAlert = (title, message, buttons) => {
    if (Platform.OS === "web") {
      // versão simplificada para web
      const confirmResult = window.confirm(`${title}\n\n${message}`);
      if (confirmResult) {
        const deleteBtn = buttons.find(b => b.style === "destructive");
        deleteBtn && deleteBtn.onPress && deleteBtn.onPress();
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  };

  showAlert("Excluir", "Deseja realmente excluir este item?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Excluir",
      style: "destructive",
      onPress: async () => {
        try {
          switch (tipo) {
            case "eventos":
              await deleteEvent(selectedItem.id);
              break;
            case "informativos":
              await deleteInformativos(selectedItem.id);
              break;
            case "atividades":
              await deleteAtividades(selectedItem.id);
              break;
            case "espacos":
              await deleteSpaces(selectedItem.id);
              break;
          }
          Alert.alert("Excluído", "Item removido com sucesso!");
          setModalVisible(false);
          onRefresh && onRefresh();
        } catch (err) {
          Alert.alert("Erro", err.message);
        }
      },
    },
  ]);
}

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            {selectedItem && (
              <>
                {selectedItem.imageUrl ? (
                  <Image
                    source={
                      typeof selectedItem.imageUrl === "string"
                        ? { uri: selectedItem.imageUrl }
                        : selectedItem.imageUrl
                    }
                    style={styles.modalImage}
                  />
                ) : null}
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                {selectedItem.descriptionModal ? (
                  <Text style={styles.modalDescription}>
                    {selectedItem.descriptionModal}
                  </Text>
                ) : null}
              </>
            )}
            <View style={styles.ContentButton}>
              {selectedItem?.isEvent && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Participe", { item: selectedItem });
                    setModalVisible(false);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.textButton}>Participe</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.button} onPress={handleDelete}>
                <Text style={styles.textButton}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate("Editar", { item: selectedItem, tipo });
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textButton}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textButton}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    maxHeight: "80%",
  },
  modalImage: {
    width: "100%",
    height: 200,
    resizeMode: "stretch",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#333",
  },
  ContentButton: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
  },
  button: {
    backgroundColor: "#d1d0d0ff",
    margin: 5,
    padding: 4,
    borderRadius: 5,
  },
  textButton: {
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },
});
