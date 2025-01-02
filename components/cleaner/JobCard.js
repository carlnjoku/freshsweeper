import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Card, Badge, Divider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import PhotoPreview from './PhotoPreview';
import moment from 'moment';
import COLORS from '../../constants/colors';

const JobCard = ({ schedules, onImagePress }) => {

  // console.log(schedules.checklist)
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{schedules.schedule?.apartment_name}</Text>
        {schedules?.status==="completed" && schedules?.verificationStatus==="Pending Approval" ? <Badge style={styles.statusApproveBadge}>Approve</Badge>
        :
        <Badge style={styles.statusBadge}>Completed</Badge>
        }
        
      </View>
      <Text style={styles.date}>Completed on :  {moment(schedules?.completed_on).format('MM DD YYYY, h:mm A')}</Text>
      {/* Show photos preview if available */}
    
        
   
      <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
        <Text style={styles.viewDetailsText}>{expanded ? "Hide Details" : "View Details"}</Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="gray" />
      </TouchableOpacity>

      {expanded && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.taskList}>
            <PhotoPreview checklist={schedules.checklist} onImagePress={onImagePress}/>
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal:7
  },
  statusApproveBadge: {
    backgroundColor: COLORS.deepBlue,
    color: '#fff',
    paddingHorizontal:7
  },
  date: {
    color: '#888',
    marginVertical: 5,
    fontSize:13
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  viewDetailsText: {
    color: 'gray',
    marginRight: 5,
  },
  divider: {
    marginVertical: 10,
  },
  taskList: {
    marginTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskLabel: {
    marginLeft: 8,
    color: '#333',
  },
});

export default JobCard;