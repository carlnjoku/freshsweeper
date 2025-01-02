// import React, { useRef } from 'react';
// import { View, Text, PanResponder, Animated, StyleSheet, Dimensions, ScrollView } from 'react-native';

// const DraggableOverlay = () => {
//   const screenHeight = Dimensions.get('window').height;
//   const overlayHeight = 200; // Change this to the desired overlay height
//   const maxOverlayTop = screenHeight - overlayHeight;

//   const pan = useRef(new Animated.Value(0)).current;

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event(
//         [null, { dy: pan }],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: (e, gestureState) => {
//         let toValue;
//         if (gestureState.dy > maxOverlayTop) {
//           toValue = maxOverlayTop;
//         } else if (gestureState.dy < 0) {
//           toValue = 0;
//         } else {
//           toValue = gestureState.dy;
//         }

//         if (gestureState.dy < maxOverlayTop / 2) {
//           toValue = 0;
//         } else {
//           toValue = maxOverlayTop;
//         }

//         Animated.spring(pan, {
//           toValue,
//           useNativeDriver: false,
//         }).start();
//       },
//     })
//   ).current;

//   const overlayStyle = {
//     transform: [{ translateY: pan }],
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.mainContent}>
//         <Text>Main Content</Text>
//       </View>

//       <Animated.View
//         style={[styles.overlay, overlayStyle]}
//         {...panResponder.panHandlers}
//       >
//         <ScrollView contentContainerStyle={styles.scrollViewContent}>
         
//           {/* Add more content here if needed */}
//         </ScrollView>
//         <View style={styles.dragHandle} />
//         <Text style={styles.text}>
//           {Array(20).fill('Scrollable Content\n')}
//         </Text>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   mainContent: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     justifyContent: 'flex-start',
//   },
//   dragHandle: {
//     width: 40,
//     height: 6,
//     backgroundColor: '#ccc',
//     alignSelf: 'center',
//     borderRadius: 3,
//     marginBottom: 10,
//   },
//     text: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 20,
//   },
// });

// export default DraggableOverlay;



import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import React, {useRef} from 'react';
import COLORS from '../constants/colors';
import * as Animatable from 'react-native-animatable';



const screenHeight = Dimensions.get('window').height;
const sheetMaxHeight = screenHeight - 200;
const sheetMinHeight = 100;

const MAX_Y = sheetMinHeight - sheetMaxHeight;
const MID_Y = MAX_Y / 2;
const MIN_Y = 0;

const THRESHOLD = 60;

const DraggableOverlay = () => {
  const lastRef = useRef(0);
  const sheetRef = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetRef.setOffset(lastRef.current);
      },
      onPanResponderMove: (_, gesture) => {
        sheetRef.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        sheetRef.flattenOffset();

        if (gesture.dy > 0) {
          //dragging down
          if (gesture.dy <= THRESHOLD) {
            lastRef.current === MAX_Y ? autoSpring(MAX_Y) : autoSpring(MID_Y);
          } else if (lastRef.current === MAX_Y) {
            autoSpring(MID_Y);
          } else {
            autoSpring(MIN_Y);
          }
        } else {
          //dragging up
          if (gesture.dy >= -THRESHOLD) {
            lastRef.current === MIN_Y ? autoSpring(MIN_Y) : autoSpring(MID_Y);
          } else {
            lastRef.current === MIN_Y ? autoSpring(MID_Y) : autoSpring(MAX_Y);
          }
        }
      },
    }),
  ).current;

  const autoSpring = value => {
    lastRef.current = value;
    Animated.spring(sheetRef, {
      toValue: lastRef.current,
      useNativeDriver: false,
    }).start();
  };
  const animatedStyles = {
    height: sheetRef.interpolate({
      inputRange: [MAX_Y, MIN_Y],
      outputRange: [sheetMaxHeight, sheetMinHeight],
      extrapolate: 'clamp',
    }),
  };
  return (
    <View style={styles.container}>
      <Animatable.View style={[styles.sheetContainer, animatedStyles]} animation="slideInUp" duration={400}>
        <View style={styles.dragbarContainer} {...panResponder.panHandlers}>
          <View style={styles.dragBar} />
        </View>
        <View style={{padding:20}}>
        <Text style={styles.text}>
          {Array(20).fill('Scrollable Content\n')}
        </Text>
        </View>
      </Animatable.View>
    </View>
  );
};

export default DraggableOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE',
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    

    elevation: 20,
    shadowColor: '#52006A',
  },
  dragbarContainer: {
    width: '100%',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
    elevation: 2,
    backgroundColor: '#f4f4f4',

    
  },
  dragBar: {
    width: 40,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 12,
    
  },
});
