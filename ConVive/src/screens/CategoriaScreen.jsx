import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import Card from "../components/Card";
import ModalCard from "../components/Modal";
import BotaoCriar from "../components/Create";
import { getEvents, getAtividades, getSpaces, getInformativos} from "../data/api";

export default function CategoriaScreen({ route }) {
  const { categoria } = route.params; // categoria enviada do HomeScreen
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let data = [];
       if (categoria.id === "eventos") {
        data = await getEvents();
      } else if (categoria.id === "atividades") {
        data = await getAtividades();
      } else if (categoria.id === "espacos") {
        data = await getSpaces();
      } else if (categoria.id === "informativos") {
        data = await getInformativos();
      }

      setItems(data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [categoria.id])
  );

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoria.name}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleItemPress(item)} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 24 }}>
            <Text>Nenhum {categoria.name.toLowerCase()} cadastrado.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          items.length === 0 ? styles.listEmpty : styles.list
        }
      />
      
      <BotaoCriar categoria={categoria} />

      <ModalCard
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedItem={selectedItem}
        tipo={categoria.id}
        onRefresh={fetchData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
