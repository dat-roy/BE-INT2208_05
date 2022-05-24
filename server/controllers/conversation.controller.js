const path = require('path');
const ConversationModel = require('../models/conversation.model');
const UserModel = require('../models/user.model');


class ConversationController {
    
    //[GET] /chat
    viewChatMenu(req, res, next) {
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
                        
                        //Note: use equals to compare two ObjectId in MongoDB
                        if (! msg.sender.equals(user._id)) {
                            if (! msg.receiver_seen) {
                                count_new_message++;
                            }
                        }
                    }
                }   
                //res.render('chat-menu', {count_new_message});
                res.status(200).json({
                    message: `get count new message`, 
                    count_new_message: count_new_message,
                    err: null,
                })
            })
            .catch((err) => {
                res.status(500).json({error: err});
            })
    }
    //[GET] /chat/box/:id
    chatBox(req, res, next) {
        let sender = req.user;
        let receiver = undefined;

        //// Check if the partner exists or not: ////
        UserModel.findById(req.params.id)
            .then(partner => {
                if (! partner) {
                    return res.status(404).json({
                        message: "Invalid partner id.",
                        sender: sender,
                        receiver: undefined,
                    })
                }
                receiver = partner;
                
                //// Find a conversation between the two users: ////
                ConversationModel.findOne(
                    {
                        $or: [
                            {
                                "member.userID_1": sender._id,
                                "member.userID_2": receiver._id,
                            },
                            {
                                "member.userID_1": receiver._id,
                                "member.userID_2": sender._id,
                            },
                        ]
                    }
                ).then(conv => {
                    if (conv) {
                        //// Update seen status ////
                        updateSeenStatus(conv, partner);
                    }
                     else {
                        //// Create a new conversation ////
                        createANewConversation();
                     }
                })
                
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error when finding user id',
                    error: err.message,
                })
            });
        
        function updateSeenStatus(conv, partner) {
            ConversationModel.updateMany({
                _id: conv._id,
            }, {
                $set: {
                    "messages.$[msg].receiver_seen": true,
                }
            }, {
                arrayFilters: [
                    {
                        $and: [
                            {"msg.sender": partner._id},
                            {"msg.receiver_seen": false},
                        ]
                    }
                ]
            }, (err, result) => {
                if (err) {
                    res.status(500).json({
                        err: err,
                    })
                }
                res.status(200).json({
                    link: `http://localhost:3030/client.js`,
                    conversation: conv,
                    sender: sender,
                    receiver: receiver,
                })
                // res.render('chat-box', {
                //     link: `http://localhost:3030/client.js`,
                //     conversation: conv,
                //     sender: sender,
                //     receiver: receiver,
                // })
            })
        }

        function createANewConversation() {
            const convRecord = new ConversationModel({
                member: {
                    userID_1: sender._id,
                    userID_2: receiver._id,
                }
            });
            convRecord.save()
               .then((result) =>{
                   res.status(200).json({
                    link: `http://localhost:3030/client.js`,
                    conversation: result,
                    sender: sender,
                    receiver: receiver,
                   })
               })
               .catch(err =>{
                   console.log(err);
               })
        }
    }

    //View all conversations related to the user
    //[GET] /chat/all
    viewAllConversations(req, res, next) {
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

                    if (user._id.equals(conv.member.userID_1)) {
                        partner_id = conv.member.userID_2;
                    } else {
                        partner_id = conv.member.userID_1;
                    }
                    console.log(partner_id);

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
                        last_msg,
                    });
                }
                res.status(200).json({
                    AllConversation: result,
                })
            })
            .catch((err) => {
                res.json({error: err});
            })
    }
}

module.exports = new ConversationController(); 