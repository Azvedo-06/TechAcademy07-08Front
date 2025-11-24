import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { createUser } from "../data/api";

export default function RegisterInserts() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Nome é obrigatório, somente letras";
    if (!form.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    if (!form.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!form.email.trim()) newErrors.email = "Email é obrigatório";
    if (!form.password.trim()) newErrors.password = "Senha é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
     
    try {
      await createUser(form);
      Alert.alert("Sucesso", "Usuário registrado com sucesso!");
      navigation.goBack(); 
    } catch (error) {
      console.log(error.message);
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="Nome"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        style={[styles.input, errors.cpf && styles.inputError]}
        placeholder="CPF, xxx.xxx.xxx-xx"
        value={form.cpf}
        onChangeText={(text) => handleChange("cpf", text)}
      />
      {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
      <TextInput
        style={[styles.input, errors.phone && styles.inputError]}
        placeholder="Telefone, (xx) xxxxx-xxxx"
        value={form.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Senha"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});
