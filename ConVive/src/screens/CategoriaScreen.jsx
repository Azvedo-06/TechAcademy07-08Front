import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ModalCard from "../components/Modal";
import BotaoCriar from "../components/Create";
import { getEvent, getAtividade, getSpace, getInformativo } from "../data/api";

export default function CategoriaScreen({ route }) {
  const { categoria } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let data = [];
      switch (categoria.id) {
        case "eventos":
          data = await getEvent();
          break;
        case "atividades":
          data = await getAtividade();
          break;
        case "espacos":
          data = await getSpace();
          break;
        case "informativos":
          data = await getInformativo();
          break;
      }

      const sanitizedData = data.map((item, index) => ({
        ...item,
        id: item.id ?? `temp-${index}`,
        title: item.title ?? "Sem título",
      }));

      setItems(sanitizedData);
    } catch (err) {
      console.log(err);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      )}
      <Text style={styles.cardTitle}>{item.title || "Sem título"}</Text>
      {item.descriptionCard && (
        <Text style={styles.cardSubtitle}>{item.descriptionCard}</Text>
      )}
      {item.date && (
        <Text style={styles.cardDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoria.name}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardSubtitle: { fontSize: 14, color: "#555", marginTop: 4 },
  cardDate: { fontSize: 12, color: "#999", marginTop: 2 },
  listEmpty: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingBottom: 16 },
});
