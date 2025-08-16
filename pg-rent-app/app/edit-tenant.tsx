import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function EditTenant() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${API_URL}/tenants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = data.find((t: any) => t.id == id);
        setTenant(found);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load tenant");
      }
    };
    fetchTenant();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/tenants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tenant),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Tenant updated");
        router.push("/dashboard");
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (!tenant) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Tenant</Text>
      <TextInput
        style={styles.input}
        value={tenant.name}
        onChangeText={(text) => setTenant({ ...tenant, name: text })}
      />
      <TextInput
        style={styles.input}
        value={tenant.phone}
        onChangeText={(text) => setTenant({ ...tenant, phone: text })}
      />
      <TextInput
        style={styles.input}
        value={tenant.room_number}
        onChangeText={(text) => setTenant({ ...tenant, room_number: text })}
      />

      {/* ✅ Replace rent_status input with dropdown */}
      <View style={styles.dropdown}>
        <Picker
          selectedValue={tenant.rent_status}
          onValueChange={(value) => setTenant({ ...tenant, rent_status: value })}
        >
          <Picker.Item label="Paid" value="Paid" />
          <Picker.Item label="Unpaid" value="Unpaid" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});
