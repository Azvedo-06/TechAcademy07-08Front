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
import { jwtDecode } from "jwt-decode";

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
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    camposPorTipo[tipo].forEach((campo) => {
      if (campo === "spaceId") {
        if (!form.spaceId) {
          newErrors.spaceId = "Selecione um espaço";
        }
        return;
      }

      if (!(form[campo] ?? "").toString().trim()) {
        newErrors[campo] = `O campo ${campo} é obrigatório`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Carregar espaços somente para eventos
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
    const token = await getToken();
    const decoded = jwtDecode(token);
    const userId = decoded.id || decoded.userId || decoded.sub;

    return {
      ...form,
      userId,
      date: form.date ? new Date(form.date).toISOString() : undefined,
      spaceId: form.spaceId ? Number(form.spaceId) : undefined,
      imageUrl: form.imageUrl || undefined,
    };
  };

  const handleSalvar = async () => {
    if (!validate()) return;

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
      Alert.alert("Erro", err.message || "Erro ao criar o item.");
    } finally {
      setLoading(false);
    }
  };

  // RENDERIZAÇÃO DOS CAMPOS
  const renderField = (campo) => {
    if (campo === "spaceId") {
      return (
        <View key={campo} style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Local</Text>
          <Picker
            selectedValue={form.spaceId}
            onValueChange={(val) => handleChange("spaceId", val)}
            style={[
              styles.input,
              errors[campo] && styles.inputError,
            ]}
          >
            <Picker.Item label="Selecione um espaço" value="" />
            {spaces.map((space) => (
              <Picker.Item
                key={space.id}
                label={space.title}
                value={space.id}
              />
            ))}
          </Picker>
          {errors[campo] && (
            <Text style={styles.errorText}>{errors[campo]}</Text>
          )}
        </View>
      );
    }

    const isMultiline = campo.includes("description");

    const placeholderMap = {
      title: "Digite o título",
      date: "AAAA-MM-DD",
      imageUrl: "https://exemplo.com/imagem.jpg",
      descriptionCard: "Resumo curto",
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
          style={[
            styles.input,
            isMultiline && { height: 80 },
            errors[campo] && styles.inputError,
          ]}
        />
        {errors[campo] && (
          <Text style={styles.errorText}>{errors[campo]}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ padding: 5 }}>
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
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 0,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  inputError: {
    borderColor: "red",
  },
});
