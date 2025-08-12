import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { API_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTenant() {
  const [name, setName] = useState("");
  const [room_number, setRoomNo] = useState("");
  const [rent_status, setRentAmount] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddTenant = async () => {
    if (!name || !room_number || !rent_status || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      // Get logged-in user's owner_id
      const ownerId = await AsyncStorage.getItem("owner_id");

      if (!ownerId) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const response = await fetch(`${API_URL}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner_id: ownerId,
          name,
          phone,
          room_number,
          rent_status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Tenant added successfully");
        setName("");
        setRoomNo("");
        setRentAmount("");
        setPhone("");
      } else {
        Alert.alert("Error", data.message || "Failed to add tenant");
      }
    } catch (error) {
      console.error("Add Tenant Error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Tenant</Text>

      <TextInput
        placeholder="Tenant Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Room No"
        value={room_number}
        onChangeText={setRoomNo}
        style={styles.input}
      />
      <TextInput
        placeholder="Rent Amount"
        value={rent_status}
        onChangeText={setRentAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <Button title="Add Tenant" onPress={handleAddTenant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
