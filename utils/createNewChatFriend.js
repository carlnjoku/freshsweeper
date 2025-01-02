import { db } from '../firebase/config';
import { ref, push, set, update, get } from "firebase/database";

// Utility function to retrieve user data
const findUserById = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// Utility function to create a new chatroom
const createChatroom = async (db, firstUserId, secondUserId, thirdUserId = "automatedUserId") => {
  const chatroomRef = push(ref(db, 'chatrooms'), {
    firstUser: firstUserId,
    secondUser: secondUserId,
    thirdUser: thirdUserId,
    messages: [],
  });
  return chatroomRef.key; // Returns the new chatroom ID
};

// Utility function to set unread messages
const initializeUnreadMessages = async (db, chatroomId, firstUserId, secondUserId) => {
  const unreadMessagesRef = ref(db, `unreadMessages/${chatroomId}/${secondUserId}/${firstUserId}`);
  await set(unreadMessagesRef, 1);
};

// Utility function to update a user's friends list
const updateFriendsList = async (db, userId, friendDetails) => {
  const userFriendsRef = ref(db, `users/${userId}/friends`);
  const snapshot = await get(userFriendsRef);
  const existingFriends = snapshot.val() || [];
  const updatedFriendsList = [...existingFriends, friendDetails];
  await update(ref(db, `users/${userId}`), { friends: updatedFriendsList });
};

// Main function to add a friend
const onAddFriend = async (uid, fbaseUser, schedule, scheduleId, cleaner_expo_token, host_expo_token) => {
    try {
      // Find the user to be added
      const user = await findUserById(uid, db);
      if (!user) {
        alert("User not found!");
        return;
      }
  
      // Prevent user from adding themselves
      if (user.userId === fbaseUser.userId) {
        alert("You cannot add yourself!");
        return;
      }
  
      // Fetch the latest friends list
      const userFriendsRef = ref(db, `users/${fbaseUser.userId}/friends`);
      const snapshot = await get(userFriendsRef);
      const friends = snapshot.exists() ? Object.values(snapshot.val()) : [];
  
      // Check if the user is already a friend based on both userId and scheduleId
      const isAlreadyFriend = friends.some(
        friend => friend.userId === user.userId && friend.scheduleId === scheduleId
      );
      if (isAlreadyFriend) {
        alert("This user is already your friend for this schedule!");
        return;
      }
  
      // Create a chatroom and get its ID
      const newChatroomId = await createChatroom(db, fbaseUser.userId, user.userId);
  
      // Send automated message to the new chatroom
      const automatedMessage = {
        _id: Math.random().toString(36).substring(7), // Generate unique message ID
        text: 'A cleaning job has been successfully paid and assigned to you.', // Automated message content
        details: {
          selected_schedule: schedule,
          selected_scheduleId: scheduleId,
          hostId: fbaseUser.userId,
          hostFname: fbaseUser.firstname,
          hostLname: fbaseUser.lastname,
          cleaner_expo_token: cleaner_expo_token,
          host_expo_token: host_expo_token,
        },
        cleaning_fee: schedule.total_cleaning_fee,
        status: 'payment_completed',
        createdAt: new Date().getTime(), // Timestamp of when the message was sent
        system: true, // Flag to indicate it's a system message
      };
  
      // Update the chatroom document with the automated message
      await update(ref(db, `chatrooms/${newChatroomId}`), {
        messages: [automatedMessage],
      });
  
      // Initialize unread messages
      await initializeUnreadMessages(db, newChatroomId, fbaseUser.userId, user.userId);
  
      // Update both users' friends lists
      const friendDetailsForCurrentUser = {
        userId: user.userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        avatar: user.avatar,
        schedule: schedule,
        scheduleId: scheduleId,
        chatroomId: newChatroomId,
      };
  
      const friendDetailsForUser = {
        userId: fbaseUser.userId,
        firstname: fbaseUser.firstname,
        lastname: fbaseUser.lastname,
        email: fbaseUser.email,
        avatar: fbaseUser.avatar,
        schedule: schedule,
        scheduleId: scheduleId,
        chatroomId: newChatroomId,
      };
  
      await updateFriendsList(db, fbaseUser.userId, friendDetailsForCurrentUser);
      await updateFriendsList(db, user.userId, friendDetailsForUser);
  
      alert("Friend added successfully!");
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("An error occurred. Please try again.");
    }
  };

export default onAddFriend;