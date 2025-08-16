import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Tenant = {
  id: number;
  name: string;
  phone: string;
  room_number: string;
  rent_status: string;
  rent_amount: string;
  due_date: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/tenants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTenants(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Fetch tenants error:", error);
      Alert.alert("Error", "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("owner_id");
    router.replace("/"); // redirect to login page
  };

  useFocusEffect(
    useCallback(() => {
      fetchTenants();
    }, [])
  );

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/tenants/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
              Alert.alert("Deleted", data.message);
              fetchTenants();
            } else {
              Alert.alert("Error", data.message || "Delete failed");
            }
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Something went wrong");
          }
        },
      },
    ]);
  };

  const filteredTenants = tenants.filter((t) => {
    const searchLower = search.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(searchLower)) ||
      (t.room_number && t.room_number.toLowerCase().includes(searchLower)) ||
      (t.rent_status && t.rent_status.toLowerCase().includes(searchLower)) ||
      (t.rent_amount &&
        t.rent_amount.toString().toLowerCase().includes(searchLower)) ||
      (t.due_date && t.due_date.toLowerCase().includes(searchLower))
    );
  });

  const renderItem = ({ item }: { item: Tenant }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>📞 {item.phone}</Text>
      <Text>🏠 Room: {item.room_number}</Text>
      <Text>
        💰 Rent: {item.rent_amount} (
        <Text
          style={[
            styles.rentStatus,
            item.rent_status === "Paid" ? styles.paid : styles.unpaid,
          ]}
        >
          {item.rent_status}
        </Text>
        )
      </Text>
      <Text>📅 Due: {item.due_date}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() =>
            router.push({ pathname: "/edit-tenant", params: { id: item.id } })
          }
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      {/* Search and tenant list inside scrollable area */}
      <FlatList
        data={filteredTenants}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <TextInput
              placeholder="Search by name, room, rent, status, due date..."
              value={search}
              onChangeText={setSearch}
              style={styles.search}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/add-tenant")}
            >
              <Text style={styles.addButtonText}>+ Add Tenant</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Logout button - full width fixed at bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  editButton: { backgroundColor: "#007bff" },
  deleteButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontWeight: "600" },
  rentStatus: { fontWeight: "bold" },
  paid: { color: "green" },
  unpaid: { color: "red" },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    margin: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 14,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
  logoutButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ff6666",
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

