import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator ,
} from "react-native";
import { getEvents, getAtividades, getSpaces, getInformativos} from "../data/api";

export default function HomeScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const eventos = await getEvents();
        //const atividades = await getAtividades();
        const espacos = await getSpaces();
        //const informativos = await getInformativos();

        const data = [
          { id: "eventos", name: "Eventos", items: eventos },
          //{ id: "atividades", name: "Atividades", items: atividades },
          { id: "espacos", name: "Espaços", items: espacos },
          //{ id: "informativos", name: "Informativos", items: informativos },
        ];

        setCategorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorias();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>Erro: {error}</Text>;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunidade que se vive</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Categorias", { categoria: item })
            }
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f0f0f0",
    padding: 30,
    borderRadius: 10,
    marginVertical: 20,
    margin: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
  },
});
