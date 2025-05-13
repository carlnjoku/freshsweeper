import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import moment from 'moment';
import userService from '../../services/userService';
import PendingPaymentItem from '../../components/host/PendingPaymentItem';

export default function RequestList({ route }) {
  const { scheduleId, apartment_name, apartment_address } = route.params;
  const { currentUserId } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('accepted');
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const response = await userService.getHostCleaningRequest(currentUserId, currentTime);
      const filtered = response.data.filter(req => req.scheduleId === scheduleId);
      setAllRequests(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = allRequests.filter(req => {
    switch(activeTab) {
      case 'accepted': return req.status === 'pending_payment';
      case 'pending': return req.status === 'pending_acceptance';
      case 'declined': return req.status === 'declined';
      default: return true;
    }
  });

  const getCount = (status) => allRequests.filter(req => req.status === status).length;

  const renderTabButton = (title, status) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === status && styles.activeTab]}
      onPress={() => setActiveTab(status)}
    >
      <Text style={[styles.tabText, activeTab === status && styles.activeTabText]}>
        {title} ({getCount(status)})
      </Text>
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <PendingPaymentItem item={item} />
      <Text style={styles.statusText}>Status: {item.status.replace('_', ' ')}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{apartment_name}</Text>
        <Text style={styles.subtitle}>{apartment_address}</Text>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('Accepted', 'accepted')}
        {renderTabButton('Pending', 'pending')}
        {renderTabButton('Declined', 'declined')}
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => `${item.id}-${item.status}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No {activeTab} requests found
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  itemContainer: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  statusText: {
    marginTop: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

































// import React, {useState, useEffect,useContext} from 'react';
// import { SafeAreaView, Text, StyleSheet, StatusBar, useWindowDimensions, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
// import PendingPaymentItem from '../../components/host/PendingPaymentItem';
// import userService from '../../services/userService';
// import { AuthContext } from '../../context/AuthContext';
// import moment from 'moment';

// export default function RequestList({route}) {
//     const {scheduleId, apartment_name, apartment_address} = route.params;
//     const {currentUser, currentUserId, geolocationData} = useContext(AuthContext)


//     const [pending_payment, setFilteredPendingPayment] = useState([]);
//     const [pending_count, setPendingCount] = useState([]);

//     useEffect(()=> {
        
//         fetchRequests()
        
//     },[])

//     const fetchRequests = async () => {

//         const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
//         // alert(currentTime)
//         try {
//           await userService.getHostCleaningRequest(currentUserId,currentTime).then((response) => {
//             const res = response.data;
//             setPendingCount(res.length)
//             // alert(res.length)
//             const total_request_sent = res.length
//             // getSchedulesByHostId
//             // getUpcomingSchedulesByHostId
//             // console.log("requests", JSON.stringify(res, null,2))
//             console.log("Where the hell is this request")
//             const now = new Date();
    
//             // Host Requests
//             const pendingRequests = res.filter(
//               // (req) => req.status === "pending_acceptance" && new Date(req.cleaning_date_time) >= now 
//               (req) => req.status === "pending_acceptance" 
          
//             );
    
//             const pendingPayment = res.filter(
//               (req) => req.status === "pending_payment" && req.scheduleId=== scheduleId
//             );
    
//             // setCleaningRequests(pendingRequests)
//             setFilteredPendingPayment(pendingPayment);
            
            
//           });
//         } catch (e) {
//           console.log(e);
//           // setLoading(false); // Ensure loading state is set to false in case of error
//         }
//       };


//       const renderPendingPayment = (item) => (
//         <View style={{marginVertical:10, marginHorizontal:10}}>
//           <PendingPaymentItem item={item} />
          
          
//         </View>
//       )

//   return (
//     <View>
//         <Text>{apartment_name}</Text>
//         <Text>{apartment_address}</Text>

//         <FlatList 
//                   data={pending_payment}
//                   renderItem = {renderPendingPayment}
//                   ListHeaderComponent={<Text style={styles.title}>Accepted Requests</Text>}
//                   ListHeaderComponentStyle={styles.list_header}
//                   ListEmptyComponent={<Text>No pending payment found</Text>}
//                   // ItemSeparatorComponent={() => <View style={styles.line}></View>}
//                   keyExtractor={(item) => item.key}
//                   numColumns={1}
//                   showsVerticalScrollIndicator={false}
//                   horizontal={false}
//                 />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//     container:{
//      flex:1,
//      marginHorizontal:5,
//      marginBottom:20
//     },
    
//    })
