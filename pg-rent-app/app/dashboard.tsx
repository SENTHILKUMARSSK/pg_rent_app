import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/config";

interface Tenant {
  id: number;
  name: string;
  phone: string;
  room_number: string;
  rent_status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const fetchTenants = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/tenants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTenants(data);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Dashboard</Text> */}

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>📞 {item.phone}</Text>
            <Text style={styles.cardText}>🏠 Room: {item.room_number}</Text>
            <Text
              style={[
                styles.cardText,
                item.rent_status === "Paid"
                  ? styles.paid
                  : styles.unpaid,
              ]}
            >
              💰 Status: {item.rent_status}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-tenant")}
      >
        <Text style={styles.addButtonText}>+ Add Tenant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#007bff",
  },
  cardText: { fontSize: 14, color: "#555" },
  paid: { color: "green", fontWeight: "bold" },
  unpaid: { color: "red", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
