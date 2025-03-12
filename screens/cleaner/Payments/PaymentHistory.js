import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, TextInput } from "react-native";
import COLORS from "../../../constants/colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Sample deposit and payout transactions
const transactions = [
  { id: "1", type: "deposit", amount: 500, date: "Jan 25, 2025" },
  { id: "2", type: "payout", amount: 200, date: "Jan 24, 2025" },
  { id: "3", type: "deposit", amount: 750, date: "Jan 20, 2025" },
  { id: "4", type: "payout", amount: 300, date: "Jan 18, 2025" },
  { id: "5", type: "payout", amount: 300, date: "Jan 19, 2025" },
  { id: "6", type: "deposit", amount: 300, date: "Jan 21, 2025" },
  { id: "7", type: "payout", amount: 300, date: "Jan 23, 2025" },
];

const PaymentHistory = ({ onDepositPress, onTransferPress }) => {
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering

  // Filter transactions based on the selected date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || transactionDate >= start) && 
      (!end || transactionDate <= end)
    );
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Balance Section */}
      <View style={styles.top}>
        <Text>Balance</Text>
        <Text style={styles.balance}>$4,000.00</Text>

        {/* Deposit and Transfer Buttons */}
        <View style={styles.container1}>
          {/* Deposit Icon */}
          <TouchableOpacity style={styles.iconContainer} onPress={onDepositPress}>
            <MaterialCommunityIcons name="arrow-down-circle" size={24} color="#fff" />
            <Text style={styles.text}> Deposits</Text>
          </TouchableOpacity>

          {/* Transfer Button */}
          <TouchableOpacity style={styles.iconContainer1} onPress={onTransferPress}>
            <MaterialCommunityIcons name="arrow-top-right" size={24} color={COLORS.gray} />
            <Text style={styles.text1}> Payouts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Range Filter */}
      <View style={styles.dateFilterContainer}>
        <Text>Start Date:</Text>
        <TextInput
          style={styles.dateInput}
          value={startDate}
          placeholder="YYYY-MM-DD"
          onChangeText={setStartDate}
        />
        <Text>End Date:</Text>
        <TextInput
          style={styles.dateInput}
          value={endDate}
          placeholder="YYYY-MM-DD"
          onChangeText={setEndDate}
        />
      </View>

      {/* Bottom Sheet (Now Contains Transaction List) */}
      <View style={styles.container}>
        {/* Transactions Header */}
        <Text style={styles.transactionTitle}>Transactions</Text>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={[styles.transactionItem, item.type === "deposit" ? styles.deposit : styles.payout]}>
              <MaterialCommunityIcons 
                name={item.type === "deposit" ? "arrow-down-circle" : "arrow-top-right"} 
                size={28} 
                color={item.type === "deposit" ? COLORS.primary : COLORS.gray} 
              />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionType}>{item.type === "deposit" ? "Deposit" : "Payout"}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                {item.type === "deposit" ? `+ $${item.amount}` : `- $${item.amount}`}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height / 1.9, // Takes half of the screen height
    backgroundColor: "#fff",
    borderTopLeftRadius: 20, // Optional rounded corners
    borderTopRightRadius: 20,
    shadowColor: COLORS.light_gray,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6, // Shadow for Android
    padding: 15,
  },

  top: {
    padding: 10,
  },
  balance: {
    fontSize: 32,
    color: COLORS.gray,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 30,
  },

  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
    width: "65%",
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  iconContainer1: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: COLORS.light_gray_1,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 5,
  },
  text1: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.light_gray,
    marginLeft: 5,
  },

  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray,
    marginBottom: 10,
  },

  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
    elevation: 2, // Shadow for Android
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deposit: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  payout: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.gray,
  },
  dateFilterContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  dateInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default PaymentHistory;