import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, List, Button, Text } from "react-native-paper";
import COLORS from "../../constants/colors";

const Support = () => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
     
      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>How can we help you?</Text>

        {/* FAQ Section */}
        <List.Section title="FAQs" style={styles.faqSection}>
          <List.Accordion
            title="How can I reset my password?"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            expanded={expanded}
            onPress={handlePress}
          >
            <List.Item title="Go to your profile settings and select 'Change Password'." />
          </List.Accordion>

          <List.Accordion
            title="How can I update my account details?"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
          >
            <List.Item title="Navigate to 'Account Settings' and edit your details there." />
          </List.Accordion>

          <List.Accordion
            title="How do I contact support?"
            left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
          >
            <List.Item title="Use the 'Contact Us' button below to reach out to us." />
          </List.Accordion>
        </List.Section>

        {/* Contact Us Button */}
        <Button
          icon="email-outline"
          mode="contained"
          onPress={() => console.log("Contact support")}
          style={styles.contactButton}
        >
          Contact Us
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  faqSection: {
    marginBottom: 24,
  },
  contactButton: {
    marginTop: 16,
    backgroundColor:COLORS.primary
  },
});

export default Support;