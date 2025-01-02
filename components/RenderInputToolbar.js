import { InputToolbar } from 'react-native-gifted-chat';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const renderInputToolbar = (props) => {
    return (
        // <InputToolbar {...props}>
        //     <TouchableOpacity onPress={handleAttachmentPress}>
        //         <Ionicons name="attach" size={24} color="black" style={{ marginRight: 10 }} />
        //     </TouchableOpacity>
        //     {props.children}
        // </InputToolbar>
        <InputToolbar {...props}>
        {/* Add attachment icon or any other additional children if needed */}
        <TouchableOpacity onPress={handleAttachmentPress}>
            <Ionicons name="attach" size={24} color="black" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        {props.children}
    </InputToolbar>
    );
};

const handleAttachmentPress = () => {
    // Add your logic here for what happens when the attachment icon is pressed
    console.log("Attachment icon pressed");
};
