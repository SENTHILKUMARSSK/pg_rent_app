import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Dashboard</Text>
      <Button title="Add Tenant" onPress={() => router.push("/add-tenant")} />
    </View>
  );
}
