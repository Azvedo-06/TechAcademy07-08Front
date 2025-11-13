import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import {
  updateEvent,
  updateAtividades,
  updateEspacos,
  updateInformativos,
} from "../data/api";

export default function EditarItemScreen({ route, navigation }) {
  const { item, tipo } = route.params;
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [imageUrl, setImagemUrl] = useState("");
  const [spaceId, setspaceId] = useState("");
  const [descricaoCard, setDescricaoCard] = useState("");
  const [descricaoModal, setDescricaoModal] = useState("");

  useEffect(() => {
    if (item) {
      setTitulo(item.title || "");
      setData(item.date || "");
      setImagemUrl(item.imageUrl || "");
      setspaceId(item.spaceId || "");
      setDescricaoCard(item.descriptionCard || "");
      setDescricaoModal(item.descriptionModal || "");
    }
  }, [item]);

  const handleSave = async () => {
    try {
      const dadosAtualizados = {}

      if ("title" in item) dadosAtualizados.title = titulo;
      if ("imageUrl" in item) dadosAtualizados.imageUrl = imageUrl;
      if ("descriptionCard" in item)
        dadosAtualizados.descriptionCard = descricaoCard;
      if ("descriptionModal" in item)
        dadosAtualizados.descriptionModal = descricaoModal;
      if ("date" in item) {
        dadosAtualizados.date = data;
      }
      if ("spaceId" in item) dadosAtualizados.spaceId = spaceId;

      switch (tipo) {
        case "eventos":
          await updateEvent(item.id, dadosAtualizados);
          break;
        case "espacos":
          await updateEspacos(item.id, dadosAtualizados);
          break;
        case "informativos":
          await updateInformativos(item.id, dadosAtualizados);
          break;
        case "atividades":
          await updateAtividades(item.id, dadosAtualizados);
          break;
      }

      Alert.alert("Sucesso", "Item atualizado!");
      navigation.goBack();
    } catch (err) {
      console.log(`${API_URL}/${tipo}/${item.id}`);
      Alert.alert("Erro: ", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título"
      />
      {(item?.date || item.date === "") && (
        <TextInput
          style={styles.input}
          value={data}
          onChangeText={setData}
          placeholder="Data"
        />
      )}
      {(item?.imageUrl || item.imageUrl === "") && (
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImagemUrl}
          placeholder="Imagem"
        />
      )}
      {(item?.local || item.local === "") && (
        <TextInput
          style={styles.input}
          value={spaceId}
          onChangeText={setspaceId}
          placeholder="Local"
        />
      )}
      {(item?.descriptionCard || item.descriptionCard === "") && (
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descricaoCard}
          onChangeText={setDescricaoCard}
          placeholder="Descrição"
          multiline
          scrollEnabled={true}
        />
      )}
      {(item?.descriptionModal || item.descriptionModal === "") && (
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descricaoModal}
          onChangeText={setDescricaoModal}
          placeholder="Descrição no Modal"
          multiline
          scrollEnabled={true}
        />
      )}
      <Button title="Salvar alterações" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});
