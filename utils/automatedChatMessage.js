// Import Firebase
import { ref, get, push, update } from 'firebase/database';
import { db } from '../firebase/config';

// Function to create a new chatroom and send automated message
export const automatedChatMessage = async (
  chatroomId,
  selected_schedule,
  selected_scheduleId,
  status,
  text_msg,
) => {

  try {

    console.log("123456789000000_________")
    console.log(chatroomId)
    console.log(selected_scheduleId)
    console.log("123456789000000_________")
   
    // Send automated message to the new chatroom
    const automatedMessage = {
      _id: Math.random().toString(36).substring(7), // Generate unique message ID
      text: text_msg, // Automated message content
      details: {
        selected_schedule:selected_schedule.schedule,
        selected_scheduleId:selected_scheduleId
      },
      status:status,
      createdAt: new Date().getTime(), // Timestamp of when the message was sent
      system: true, // Flag to indicate it's a system message
    };

    // Fetch the current list of messages from the chatroom document
    const chatroomRef = ref(db, `chatrooms/${chatroomId}`);
    // Fetch the current chatroom data
    const chatroomSnapshot = await get(chatroomRef);
    // Get the current messages array from the chatroom data
    const currentMessages = chatroomSnapshot.val().messages || [];

    // Append the new message to the current list of messages
    const updatedMessages = [...currentMessages, automatedMessage];

    // Update the chatroom document with the updated list of messages
    update(ref(db, `chatrooms/${chatroomId}`), {
      messages: updatedMessages,
    });

    console.log('Automated message sent successfully.');
  } catch (error) {
    console.error('Error sending automated message:', error);
  }
};
