import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import COLORS from '../../constants/colors'; // Assuming you have a colors constant file
import userService from '../../services/userService'; // Service to fetch the pending payments
import { AuthContext } from '../../context/AuthContext';
import CardNoPrimary from '../../components/CardNoPrimary';
import ROUTES from '../../constants/routes';

const PaymentHistory = ({ navigation }) => {

    const {currentUserId, currency} = useContext(AuthContext)

    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            // Assuming userService.getPendingPayments fetches the pending payments from the API
            const response = await userService.getPaymentsByHostId(currentUserId);
            setPendingPayments(response.data);
            // console.log(response.data)
        } catch (error) {
            console.log(error);
            alert('Error fetching pending payments');
        } finally {
            setLoading(false);
        }
    };

    // Calculate the total sum of all schedule prices
    // const totalSum = pendingPayments.reduce((sum, schedule) => sum + schedule.total_cleaning_fee, 0);
    const totalSum = pendingPayments.reduce((sum, schedule) => {
        // Check if total_cleaning_fee exists and convert it to a number
        const fee = parseFloat(schedule.total_cleaning_fee) || 0;
        return sum + fee;
      }, 0);
      

      const renderItem = ({ item }) => {
        switch (item.type) {

            case 'payment_header' :
                return(
                    <View>
                        <View style={styles.top}> 
                            <Text style={styles.heading}>Completed Schedules</Text>
                            <Text style={styles.subheading}>Total payment due is automatically calculated based on completed cleaning schedules</Text>

                            {/* Total Amount Due Section */}
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountText}>Total Amount Due:</Text>
                            <View>
                                <Text style={styles.totalText}>${totalSum.toFixed(2)}</Text> 
                                <Text style={{fontSize:14, color:COLORS.primary}}>Mark as Paid</Text> 
                            </View>
                        </View>
                        </View>


                        <View style={styles.main_content}>
                            <FlatList
                                data={pendingPayments}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                <CardNoPrimary>
                                    {/* Display schedule details */}
                                    {/* <Text style={styles.scheduleId}>Schedule ID: #{item._id}</Text> */}
                                    <Text style={styles.scheduleId}>Apartment: {item.apartment_name}</Text>
                                    <Text style={styles.cleanerName}>Cleaner: {item.cleaner_firstname} {item.cleaner_lastname}</Text>
                                    <Text style={styles.completionDate}>Completed On: {item.cleaning_date}</Text>
                                    {/* <Text style={styles.task}>Service: {item.taskType}</Text> */}

                                    {/* Display price */}
                                    <Text style={styles.price}>${item.total_cleaning_fee}</Text>
                                </CardNoPrimary>
                                )}
                            />
                      
                        </View> 
                    </View>
                )


                case 'schedules':
                    return (
                    <View style={{minHeight:100}}>
                        {/* Summary Section */}
                        {/* <View style={styles.summary}>
                            <Text style={styles.subtotalText}>Subtotal: ${totalSum.toFixed(2)}</Text>
                            <Text style={styles.taxText}>Taxes (10%): ${(totalSum * 0.10).toFixed(2)}</Text>
                            <Text style={styles.totalText}>Grand Total: ${(totalSum * 1.10).toFixed(2)}</Text>
                        </View> */}

                        {/* Download Button */}
                        <TouchableOpacity onPress={()=> handlePayment(totalSum)}  style={styles.downloadButton}>
                            <Text style={styles.downloadButtonText}>Pay Now </Text>
                        </TouchableOpacity>
                        
                    </View>
                    )

            }
        }
   

    // const renderItem = ({ item }) => (
    //     <View style={styles.paymentItem}>
    //         <View style={styles.details}>
    //             <Text style={styles.label}>Schedule ID:</Text>
    //             <Text style={styles.value}>{item.apartment_name}</Text>

    //             <Text style={styles.label}>Cleaner ID:</Text>
    //             <Text style={styles.value}>{item.cleanerId}</Text>

    //             <Text style={styles.label}>Total Cleaning Fee:</Text>
    //             <Text style={styles.value}>${item.total_cleaning_fee}</Text>

    //             <Text style={styles.label}>Status:</Text>
    //             <Text style={[styles.value, styles.pending]}>Pending</Text>
    //         </View>

    //         <TouchableOpacity style={styles.payButton} onPress={() => handlePayment(item)}>
    //             <Text style={styles.buttonText}>Pay Now</Text>
    //         </TouchableOpacity>
    //     </View>
    // );

    const handlePayment = (invoice) => {
        // Navigate to payment screen or trigger payment process
        navigation.navigate(ROUTES.host_checkout, { pendingPayments: pendingPayments });
    };

    if (loading) {
        return <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />;
    }

    if (pendingPayments.length === 0) {
        return (
            <View style={styles.noData}>
                <Text style={styles.noDataText}>No pending payments at the moment.</Text>
            </View>
        );
    }

    const data = [
        { type: 'payment_header' },
        { type: 'schedules'},

      ];

    return (
        <View style={{backgroundColor:COLORS.backgroundColor}}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            
            />
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        backgroundColor: COLORS.backgroundColor,
        flexGrow: 2,
    },

    top:{
        backgroundColor:COLORS.primary,
        padding:10,
        paddingBottom:20
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white, // Adjust color as per design
        marginBottom: 5,
      },
      subheading: {
        fontSize: 14,
        color: COLORS.white,
        opacity: 0.8,
        marginBottom: 15,
      },
      main_content:{
        padding:10,
        backgroundColor: COLORS.backgroundColor,
      },
      amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.primary_light_1,
        paddingHorizontal: 10,
        paddingVertical:20,
        borderRadius: 8,
        marginTop: 10,
        position:'relative',
        top:30,
        zIndex: 6,
      },
      amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
      },
      amountValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.success, // Highlight the amount
      },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 18,
        color: COLORS.gray,
    },
      dateRange: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
      },
      scheduleItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      scheduleId: {
        fontSize: 16,
        fontWeight: '500',
      },
      apartmentName: {
        fontSize: 16,
        marginVertical: 5,
      },
      cleanerName: {
        fontSize: 14,
        color: '#666',
      },
      completionDate: {
        fontSize: 14,
        color: '#999',
        marginBottom: 5,
      },
      task: {
        fontSize: 16,
        color: '#555',
      },
      price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
      },
      summary: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      subtotalText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      taxText: {
        fontSize: 16,
        marginVertical: 10,
      },
      totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
      },
      downloadButton: {
        marginTop: 20,
        marginHorizontal:15,
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
      },
      downloadButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
      },
});

export default PaymentHistory;