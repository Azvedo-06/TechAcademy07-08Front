import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  getEvent,
  getAtividade,
  getSpace,
  getInformativo,
  logout,
  getLoggedUser,
} from "../data/api";
import MenuPerfil from "../components/MenuPerfil";

export default function HomeScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={{ fontSize: 22, marginRight: 15 }}>⋮</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const hundlelogout = async () => {
    try {
      await logout();
      navigation.replace("LoginScreen");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getLoggedUser();
        setUser(userData);
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    }

    async function fetchCategorias() {
      try {
        const eventos = await getEvent();
        //const atividades = await getAtividade();
        const espacos = await getSpace();
        //const informativos = await getInformativo();

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
    loadUser();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>Erro: {error}</Text>;

  return (
    <View style={styles.container}>
      <MenuPerfil
        visible={menuVisible}
        user={user}
        onLogout={hundlelogout}
        onClose={() => setMenuVisible(false)}
      />

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
});
