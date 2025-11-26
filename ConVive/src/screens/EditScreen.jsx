import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { API_URL } from "../data/config";
import { Picker } from "@react-native-picker/picker";

import {
  updateEvent,
  updateAtividade,
  updateSpace,
  updateInformativo,
  getSpace,
} from "../data/api";

export default function EditarItemScreen({ route, navigation }) {
  const { item, tipo } = route.params;

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [imageUrl, setImagemUrl] = useState("");
  const [spaceId, setspaceId] = useState("");
  const [descricaoCard, setDescricaoCard] = useState("");
  const [descricaoModal, setDescricaoModal] = useState("");
  const [spaces, setSpaces] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await getSpace();
      setSpaces(res);
    } catch (err) {
      console.log("Erro ao carregar espaços:", err);
    }
  };

  useEffect(() => {
    if (item) {
      setTitulo(item.title || "");
      setData(item.date || "");
      setImagemUrl(item.imageUrl || "");
      setspaceId(item.spaceId ? String(item.spaceId) : "");
      setDescricaoCard(item.descriptionCard || "");
      setDescricaoModal(item.descriptionModal || "");
    }
  }, [item]);

  const validate = () => {
    const newErrors = {};

    if (!titulo?.trim()) newErrors.titulo = "O título é obrigatório.";

    if ("date" in item && !data?.trim())
      newErrors.data = "A data é obrigatória.";

    if ("imageUrl" in item && !imageUrl?.trim())
      newErrors.imageUrl = "A URL da imagem é obrigatória.";

    if ("spaceId" in item && !spaceId?.trim())
      newErrors.spaceId = "É necessário selecionar um espaço.";

    if ("descriptionCard" in item && !descricaoCard?.trim())
      newErrors.descricaoCard = "A descrição do card é obrigatória.";

    if ("descriptionModal" in item && !descricaoModal?.trim())
      newErrors.descricaoModal = "A descrição do modal é obrigatória.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const dadosAtualizados = {};

      if ("title" in item) dadosAtualizados.title = titulo;
      if ("imageUrl" in item) dadosAtualizados.imageUrl = imageUrl;
      if ("descriptionCard" in item)
        dadosAtualizados.descriptionCard = descricaoCard;
      if ("descriptionModal" in item)
        dadosAtualizados.descriptionModal = descricaoModal;
      if ("date" in item) dadosAtualizados.date = data;
      if ("spaceId" in item) {
        dadosAtualizados.spaceId = Number(spaceId);
      }

      switch (tipo) {
        case "eventos":
          await updateEvent(item.id, dadosAtualizados);
          break;
        case "espacos":
          await updateSpace(item.id, dadosAtualizados);
          break;
        case "informativos":
          await updateInformativo(item.id, dadosAtualizados);
          break;
        case "atividades":
          await updateAtividade(item.id, dadosAtualizados);
          break;
      }

      Alert.alert("Sucesso", "Item atualizado!");
      navigation.goBack();
    } catch (err) {
      console.log(`${API_URL}/${tipo}/${item.id}`);
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={[styles.input, errors.titulo && styles.inputError]}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título"
      />
      {errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}

      {"date" in item && (
        <>
        <Text style={styles.label}>Data</Text>
          <TextInput
            style={[styles.input, errors.data && styles.inputError]}
            value={data}
            onChangeText={setData}
            placeholder="Data"
          />
          {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
        </>
      )}

      {"imageUrl" in item && (
        <>
          <Text style={styles.label}>Url da imagem</Text>
          <TextInput
            style={[styles.input, errors.imageUrl && styles.inputError]}
            value={imageUrl}
            onChangeText={setImagemUrl}
            placeholder="Imagem"
          />
          {errors.imageUrl && (
            <Text style={styles.errorText}>{errors.imageUrl}</Text>
          )}
        </>
      )}

      {"spaceId" in item && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Local</Text>

          <Picker
            selectedValue={spaceId}
            onValueChange={(val) => setspaceId(String(val))}
            style={[styles.input, errors.spaceId && styles.inputError]}
          >
            <Picker.Item label="Selecione um espaço" value="" />

            {spaces.map((space) => (
              <Picker.Item
                key={space.id}
                label={space.title}
                value={String(space.id)}
              />
            ))}
          </Picker>

          {errors.spaceId && (
            <Text style={styles.errorText}>{errors.spaceId}</Text>
          )}
        </View>
      )}

      {"descriptionCard" in item && (
        <>
          <Text style={styles.label}>Descrição Curta</Text>
          <TextInput
            style={[
              styles.input,
              { height: 100 },
              errors.descricaoCard && styles.inputError,
            ]}
            value={descricaoCard}
            onChangeText={setDescricaoCard}
            placeholder="Descrição"
            multiline
          />
          {errors.descricaoCard && (
            <Text style={styles.errorText}>{errors.descricaoCard}</Text>
          )}
        </>
      )}

      {"descriptionModal" in item && (
        <>
          <Text style={styles.label}>Descrição Longa</Text>
          <TextInput
            style={[
              styles.input,
              { height: 100 },
              errors.descricaoModal && styles.inputError,
            ]}
            value={descricaoModal}
            onChangeText={setDescricaoModal}
            placeholder="Descrição no Modal"
            multiline
          />
          {errors.descricaoModal && (
            <Text style={styles.errorText}>{errors.descricaoModal}</Text>
          )}
        </>
      )}

      <Button style={styles.button} title="Salvar alterações" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#cccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    marginLeft: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 0,
  },
});
