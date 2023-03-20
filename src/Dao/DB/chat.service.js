import { messagesModel } from "./models/messages.js";

export default class MessageService {

    getMessages = async () =>{
        let messages = await messagesModel.find({})
        return messages;
    }

    saveMessages = async (newMessage) =>{
        let result = await messagesModel.create(newMessage);
        return result;
    }
}