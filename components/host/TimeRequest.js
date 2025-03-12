import React from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import COLORS from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import { Chip } from 'react-native-paper';
import ButtonPrimary from '../ButtonPrimary';
import { Badge } from 'react-native-paper';
import { useCleaningTimer } from '../../context/CleaningTimerContext';
import userService from '../../services/userService';

const TimeRequest = ({item, status }) => {

    const convertMinutes = (minutes) => {
        const duration = moment.duration(minutes, 'minutes');
        return `${duration.hours()}h ${duration.minutes()}m`;
    };

   const navigation = useNavigation();

   const { startTimer, timeLeft } = useCleaningTimer();
  


    // console.log("my request", JSON.stringify(item.item, null, 2))
    const handleApprove = async() => {
        try {
            const data = {
                scheduleId:item.item?.scheduleId,
                requestId:item.item?._id,
                cleaning_end_time:item.item?.cleaning_end_time,
                extraTime:item.item?.extraTime
            }
            
            await userService.updateTimeRequest(data).then((response) => {
            const res = response.data;
            // console.log(res)
            Alert.alert("Success", "Extra time wass successfully approved")
            
            startTimer(extraTime);
            
            //   startTimer(1800, schedule); // Start a 30-minute timer

            });
        } catch (e) {
            console.log(e);
        
        }
    }
  return (
   
    <View>
        <View style={styles.card}>
            <Text style={styles.apartmentName}>{item.item?.apartmentName}</Text>
            <Text style={styles.cleanerName}>Cleaner: {item.item?.cleanerFirstname} {item.item?.cleanerLastname}</Text>
            <View style={styles.timeContainer}>
                <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Text>Requested Time:</Text>
                    <Chip style={styles.chip} textStyle={styles.chipText}>
                        {convertMinutes(item.item?.extraTime)}
                    </Chip>
                </View>
                <Chip style={[styles.statusChip, item.item?.status === 'Pending' ? styles.pending : styles.approved]}>
                    {item.item?.status}
                </Chip>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleApprove(item.item._id)}>
                <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
        </View>
    </View>
        
      

  );
};

const styles = StyleSheet.create({
  

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
},
apartmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
},

cleanerName: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
},
timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
},
chip: {
    backgroundColor: COLORS.white,
},
chipText: {
    color: COLORS.darkGray,
},
statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
},
pending: {
    backgroundColor: COLORS.primary_light_1,
    borderRadius:50
},
approved: {
    backgroundColor: '#E0F2E9',
    borderRadius:50
},
button: {
    marginTop: 15,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth:1,
    alignItems: 'center',
    borderColor:COLORS.light_gray
},
buttonText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
},
emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 20,
},
});

export default TimeRequest;
