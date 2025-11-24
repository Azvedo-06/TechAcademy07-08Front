import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { getToken } from "../data/authStorage";
import {jwtDecode} from "jwt-decode";

import {
  createEvent,
  createAtividade,
  createSpace,
  createInformativo,
  getSpace,
} from "../data/api";

export default function CreateScreen({ navigation, route }) {
  const { tipo } = route.params;

  const camposPorTipo = {
    eventos: [
      "title",
      "date",
      "spaceId",
      "imageUrl",
      "descriptionCard",
      "descriptionModal",
    ],
    atividades: ["title", "descriptionCard", "descriptionModal"],
    espacos: ["title", "imageUrl", "descriptionCard", "descriptionModal"],
    informativos: ["title", "descriptionCard", "descriptionModal"],
  };

  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState(
    camposPorTipo[tipo].reduce((acc, campo) => ({ ...acc, [campo]: "" }), {})
  );
  const [loading, setLoading] = useState(false);

  // Carrega espaços se for tipo eventos
  useEffect(() => {
    if (tipo === "eventos") {
      (async () => {
        try {
          const response = await getSpace();
          const array = Array.isArray(response)
            ? response
            : response?.data ?? [];
          setSpaces(array);
        } catch (err) {
          console.log(err);
          Alert.alert("Erro", "Não foi possível carregar os espaços.");
        }
      })();
    }
  }, [tipo]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatData = async (form) => {
  try {
    const token = await getToken(); 
    if (!token) throw new Error("Usuário não encontrado no token");

    const decoded = jwtDecode(token);
    const userId = decoded.id || decoded.userId || decoded.sub;
    if (!userId) throw new Error("Usuário não encontrado no token");

    return {
      ...form,
      userId,
      date: form.date ? new Date(form.date).toISOString() : undefined,
      spaceId: form.spaceId ? Number(form.spaceId) : undefined,
      imageUrl: form.imageUrl || undefined,
      descriptionCard: form.descriptionCard || "",
      descriptionModal: form.descriptionModal || "",
    };
  } catch (err) {
    console.log("Erro ao pegar usuário logado:", err);
    throw err;
  }
};

  const handleSalvar = async () => {
    if (!form.title || (camposPorTipo[tipo].includes("date") && !form.date)) {
      Alert.alert(
        "Atenção",
        "Preencha pelo menos o título e a data (se houver)."
      );
      return;
    }

    if (tipo === "eventos" && (!form.spaceId || isNaN(form.spaceId))) {
      Alert.alert("Erro", "Selecione um espaço válido.");
      return;
    }

    setLoading(true);
    try {
      const novoItem = await formatData(form);

      switch (tipo) {
        case "eventos":
          await createEvent(novoItem);
          break;
        case "atividades":
          await createAtividade(novoItem);
          break;
        case "espacos":
          await createSpace(novoItem);
          break;
        case "informativos":
          await createInformativo(novoItem);
          break;
      }

      route.params?.onCreate?.();
      Alert.alert("Sucesso!", `${tipo} criado com sucesso.`);
      navigation.goBack();
    } catch (err) {
      console.log("ERRO AO CRIAR:", err);
      Alert.alert("Erro", err.message || "Ocorreu um erro ao criar o item.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (campo) => {
    if (campo === "spaceId") {
      return (
        <View key={campo} style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Local</Text>
          <Picker
            selectedValue={form.spaceId}
            onValueChange={(val) => handleChange("spaceId", val)}
            style={styles.input}
          >
            <Picker.Item label="Selecione um espaço" value="" key="default" />
            {Array.isArray(spaces) &&
              spaces.map((space, index) => (
                <Picker.Item
                  key={space.id ?? `temp-${index}`}
                  label={space.title ?? "Sem nome"}
                  value={space.id ?? ""}
                />
              ))}
          </Picker>
        </View>
      );
    }

    const isMultiline = campo.includes("description");
    const placeholderMap = {
      title: "Digite o título",
      date: "AAAA-MM-DD",
      imageUrl: "https://exemplo.com/imagem.jpg",
      descriptionCard: "Descrição curta",
      descriptionModal: "Descrição completa",
    };

    return (
      <View key={campo} style={{ marginBottom: 12 }}>
        <Text style={styles.label}>{campo}</Text>
        <TextInput
          value={form[campo]}
          onChangeText={(text) => handleChange(campo, text)}
          placeholder={placeholderMap[campo] || campo}
          multiline={isMultiline}
          style={[styles.input, isMultiline && { height: 80 }]}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ padding: 16 }}>
        {camposPorTipo[tipo].map((campo) => renderField(campo))}

        <TouchableOpacity
          onPress={handleSalvar}
          disabled={loading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {loading ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
});
