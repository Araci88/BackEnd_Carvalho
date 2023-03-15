import { messagesModel } from "./models/messages.js";

export default class MessageService {

    getMessages = async () =>{
        let messages = await messagesModel.find({})
        return messages;
    }

    saveMessages = async (data) =>{
        let result = await messagesModel.create(data);
        return result;
    }
}