import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, useTheme, List, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BookingList = ({ bookings }) => {
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}>
      {bookings.map((booking, index) => (
        <Card key={index} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={styles.title}>
                {booking.date} - {booking.start} to {booking.end}
              </Title>
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={24}
                    color={colors.primary}
                  />
                )}
                onPress={() => console.log('View details')}
              />
            </View>
            <Paragraph style={styles.subtitle}>
              <MaterialCommunityIcons
                name="account"
                size={16}
                color={colors.text}
              />{' '}
              Cleaner: {booking.cleaner_id}
            </Paragraph>
            <Paragraph style={styles.subtitle}>
              <MaterialCommunityIcons
                name="clock"
                size={16}
                color={colors.text}
              />{' '}
              Duration: {booking.duration} hours
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => console.log('Edit booking')}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => console.log('Delete booking')}
            />
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    marginVertical: 4,
    color: '#666',
  },
  actions: {
    justifyContent: 'flex-end',
  },
});

export default BookingList;