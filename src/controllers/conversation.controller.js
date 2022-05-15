const path = require('path');
const ConversationModel = require('../models/conversation.model');
const UserModel = require('../models/user.model');


class ConversationController {
    
    //[Gvet] /chat
    searchUser(req, res, next) {
        res.render('search-user');
    }
    //[POST] /chat
    searchUserResult(req, res, next) {
        const search_name = req.body.search_user;
        const sender = req.user;
        const user_id_1 = req.user._id;
    
        UserModel.findOne({  username: search_name })
            .then(user => {
                const receiver = user;
                const user_id_2 = user._id;
                ConversationModel.findOne(
                    {
                        $or: [
                            {
                                "member.userID_1": user_id_1,
                                "member.userID_2": user_id_2,
                            },
                            {
                                "member.userID_1": user_id_2,
                                "member.userID_2": user_id_1,
                            },
                        ]
                    }
                ).then(conversation => {
                    if (conversation) {
                        res.render('chat-box', {
                            conversation: conversation,
                            sender: sender,
                            receiver: receiver,
                        });
                    }
                     else {
                         console.log('khong tim thay hoi thoai');
                         const conversationRecord = new ConversationModel({
                             conversation_id: Object._id,
                             member: {
                                 userID_1: user_id_1,
                                 userID_2: user_id_2,
                             },
                             total_messages: 0
                         });
                         conversationRecord.save()
                         .then((result) =>{
                             res.render('chat-box', {
                                 conversation: result,
                                 sender: sender,
                                 receiver: receiver,
                             });
                         })
                         .catch(err =>{
                             console.log(err);
                         })
                     }
                })
                
            })
            .catch(err => {
                console.log('khong tim thay tai khoan: ', err.message);
            })

    }

    renderConversation(req, res) {
        const user = req.user;
        ConversationModel.find({
            $or: [
                {"member.userID_1": user._id},
                {"member.userID_2": user._id},
            ]
        })
            .then((conv_list) => {
                let count_new_message = 0;
                for (const conv of conv_list) {
                    for (const msg of conv.messages) {
                        if (msg.sender != user._id) {
                            if (! msg.receiver_seen) {
                                count_new_message++;
                            }
                        }
                    }
                }   
                res.render('view-conv', {count_new_message});
            })
            .catch((err) => {
                res.json({error: err});
            })
    }
    insideChatBox(req, res, next) {
        //Tim tat ca cac hoi thoai cua user
        const user = req.user;
        ConversationModel.find({
            $or: [
                {"member.userID_1": user._id},
                {"member.userID_2": user._id},
            ]
        })
            .then( async (conv_list) => {

                let result = [];

                for (const conv of conv_list) {
                    let partner_id;
                    let username;
                    let avatar;
                    if (user._id == conv.member.userID_1) {
                        partner_id = conv.member.userID_2;
                    } else {
                        partner_id = conv.member.userID_1;
                    }
                    const partner = await UserModel.findById(partner_id);
                    if (partner) {
                        username = partner.username;
                        avatar = partner.picture.name;
                    } else {
                        res.json({error: "User not found"});
                    }
                    let last_msg = conv.messages[conv.messages.length - 1];

                    result.push({
                        partner_id,
                        username,
                        avatar,
                        last_msg
                    });
                }
                console.log(result);
                res.send(result);
            })
            .catch((err) => {
                res.json({error: err});
            })
    }

}

module.exports = new ConversationController();  