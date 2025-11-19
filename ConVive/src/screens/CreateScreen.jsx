import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  createEvent,
  createAtividades,
  createSpaces,
  createInformativos,
} from "../data/api";

export default function CreateScreen({ navigation, route }) {
  const { tipo } = route.params;
  const camposPorTipo = {
    eventos: ["title","date","spaceId","imageUrl","descriptionCard","descriptionModal"],
    atividades: ["title","descriptionCard","descriptionModal"],
    espacos: ["title","imageUrl","descriptionCard","descriptionModal"],
    informativos: ["title","descriptionCard","descriptionModal"]
  };
  
  const [form, setForm] = useState({
    title: "",
    date: "",
    spaceId: "",
    imageUrl: "",
    descriptionCard: "",
    descriptionModal: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSalvar = async () => {
    if (!form.title || (camposPorTipo[tipo].includes("date") && !form.date)) {
      Alert.alert(
        "Atenção",
        `Preencha pelo menos o campo de título e data(se tiver).`
      );
      return;
    }

    const novoItem = {};
    camposPorTipo[tipo].forEach((key) => {
      novoItem[key] =
        form[key] || (key === "local" ? "Local não informado" : "");
    });
    if (tipo === "eventos") novoItem.isEvent = true;

    try {
      switch (tipo) {
        case "eventos":
          await createEvent(novoItem);
          break;
        case "atividades":
          await createAtividades(novoItem);
          break;
        case "espacos":
          await createSpaces(novoItem);
          break;
        case "informativos":
          await createInformativos(novoItem);
          break;
      }

      if (route.params?.onCreate) {
        route.params.onCreate();
      }

      Alert.alert("Sucesso!", `${tipo} criado com sucesso.`);
      navigation.goBack();
    } catch (Error) {
      Alert.alert(Error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 20}}
          keyboardShouldPersistTaps="always"
        >
          <Text style={styles.title}>Criar Novo {tipo}</Text>

          {camposPorTipo[tipo].includes("title") && (
            <>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o título"
                value={form.title}
                onChangeText={(val) => handleChange("title", val)}
              />
            </>
          )}

          {camposPorTipo[tipo].includes("date") && (
            <>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA/MM/DD"
                value={form.date}
                onChangeText={(val) => handleChange("date", val)}
              />
            </>
          )}

          {camposPorTipo[tipo].includes("spaceId") && (
            <>
              <Text style={styles.label}>Local</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o local"
                value={form.spaceId}
                onChangeText={(val) => handleChange("spaceId", val)}
              />
            </>
          )}

          {camposPorTipo[tipo].includes("imageUrl") && (
            <>
              <Text style={styles.label}>URL da Imagem</Text>
              <TextInput
                style={styles.input}
                placeholder="https://exemplo.com/imagem.jpg"
                value={form.imageUrl}
                onChangeText={(val) => handleChange("imageUrl", val)}
              />
            </>
          )}

          {camposPorTipo[tipo].includes("descriptionCard") && (
            <>
              <Text style={styles.label}>Descrição curta</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Descrição curta"
                multiline
                value={form.descriptionCard}
                onChangeText={(val) => handleChange("descriptionCard", val)}
              />
            </>
          )}

          {camposPorTipo[tipo].includes("descriptionModal") && (
            <>
              <Text style={styles.label}>Descrição completa</Text>
              <TextInput
                style={[styles.input, { height: 120 }]}
                placeholder="Descrição completa"
                multiline
                value={form.descriptionModal}
                onChangeText={(val) => handleChange("descriptionModal", val)}
              />
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar {tipo}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
