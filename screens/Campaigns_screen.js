import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../config";

const AccountCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/user_campaigns/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCancel = async (campaignId) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      await axios.post(
        `${API_BASE_URL}/cancel_campaign/${campaignId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", "Campaign cancelled.");
    } catch (error) {
      Alert.alert("Error", "Could not cancel campaign.");
    }
  };

  const renderCampaign = ({ item }) => {
    const progress =
      (item.current_quantity /
        item.variant.minimum_order_quantity_for_offer) *
      100;

    const literOrWeight = item.variant.liter
      ? `${item.variant.liter} L`
      : item.variant.weight
      ? `${item.variant.weight} kg`
      : "N/A";

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Campaign #{item.id}</Text>
          <Text
            style={[
              styles.status,
              { color: item.is_active ? "#34C759" : "#FF3B30" },
            ]}
          >
            {item.is_active ? "Active" : "Inactive"}
          </Text>
        </View>

        {item?.variant?.variant_images?.[0]?.image_url && (
          <Image
            source={{ uri: item.variant.variant_images[0].image_url }}
            style={styles.image}
          />
        )}

        <View style={styles.detailRow}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{item.title}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Volume:</Text>
          <Text style={styles.value}>{literOrWeight}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Discounted Price:</Text>
          <Text style={styles.value}>${item.discounted_price}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Ordered Quantity:</Text>
          <Text style={styles.value}>{item.current_quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Required Quantity:</Text>
          <Text style={styles.value}>
            {item.variant.minimum_order_quantity_for_offer}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {new Date(item.start_time).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          Progress: {Math.floor(progress)}%
        </Text>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancel(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Campaign</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#228B22" />
        <Text style={styles.loadingText}>Loading your campaigns...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Your Campaigns ({campaigns.length})</Text>
      <FlatList
        data={campaigns}
        renderItem={renderCampaign}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#1A1A1A",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#34C759",
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountCampaigns;
