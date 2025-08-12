import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { API_URL } from "../constants/config";

export default function AddTenant() {
  const [name, setName] = useState("");
  const [room_number, setRoomNo] = useState("");
  const [rent_status, setRentAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddTenant = async () => {
    if (!name || !room_number || !rent_status || !dueDate) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
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
        setDueDate("");
      } else {
        Alert.alert("Error", data.message || "Failed to add tenant");
      }
    } catch (error) {
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
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
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
