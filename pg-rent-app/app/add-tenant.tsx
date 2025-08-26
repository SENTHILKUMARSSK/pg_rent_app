import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function AddTenant() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [room_number, setRoomNo] = useState("");
  const [rent_status, setRentStatus] = useState("Unpaid"); // default
  const [phone, setPhone] = useState("");
  const [rent_amount, setRentAmount] = useState("");
  const [due_date, setDueDate] = useState("");

  const handleAddTenant = async () => {
    if (!name || !room_number || !rent_status || !phone || !rent_amount || !due_date) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const ownerId = await AsyncStorage.getItem("owner_id");
      if (!ownerId) {
        Alert.alert("Error", "User not logged in");
        return;
      }
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner_id: ownerId,
          name,
          phone,
          room_number,
          rent_status,
          rent_amount,
          due_date,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Tenant added successfully");
        router.push("/dashboard");
        setName("");
        setRoomNo("");
        setRentStatus("Unpaid");
        setPhone("");
        setRentAmount("");
        setDueDate("");
      } else {
        Alert.alert("Error", data.message || "Failed to add tenant");
      }
    } catch (error) {
      console.error("Add Tenant Error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Add Tenant</Text>

      <TextInput placeholder="Tenant Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <TextInput placeholder="Room No" value={room_number} onChangeText={setRoomNo} style={styles.input} />
      <TextInput placeholder="Rent Amount" value={rent_amount} onChangeText={setRentAmount} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="YYYY-MM-DD" value={due_date} onChangeText={setDueDate} style={styles.input} />

      {/* Rent Status Dropdown */}
      <Picker
        selectedValue={rent_status}
        onValueChange={(itemValue) => setRentStatus(itemValue)}
        style={styles.Paidinput}
      >
        <Picker.Item label="Paid" value="Paid" />
        <Picker.Item label="Unpaid" value="Unpaid" />
      </Picker>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTenant}>
        <Text style={styles.addButtonText}>+ Add Tenant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  Paidinput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
