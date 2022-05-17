export const updateChatsWithNewMessage = (prevChats, message) => {
  const newChats = prevChats.map(chat => {
    if (chat._id === message.chatId) {
      return {...chat, messages: [...chat.messages, message]};
    }
    return chat;
  });
  return newChats;
};

export const updateCurrentChatWithNewMessage = (currentChat, message) => {
  const newCurrentChat = {
    ...currentChat,
    messages: [...currentChat.messages, message],
  };

  return newCurrentChat;
};

export const updateChatsEditedMessage = (prevChats, editedMsg) => {
  const newChats = prevChats.map(chat => {
    if (chat._id === editedMsg.chatId) {
      const newMessages = chat.messages.map(message => {
        return message.subId === editedMsg.subId
          ? {...message, ...editedMsg}
          : message;
      });
      return {...chat, messages: newMessages};
    }
    return chat;
  });

  return newChats;
};

export const updateCurrentChatEditedMessage = (currentChat, editedMsg) => {
  if (currentChat._id !== editedMsg.chatId) {
    return currentChat;
  } else {
    const newMessages = currentChat.messages.map(message => {
      return message.subId === editedMsg.subId
        ? {...message, ...editedMsg}
        : message;
    });
    const newCurrentChat = {...currentChat, messages: newMessages};

    return newCurrentChat;
  }
};

export const deleteMessageInChatsList = (prevChats, deletedMsg) => {
  const newChats = prevChats.map(chat => {
    if (chat._id === deletedMsg.chatId) {
      return {
        ...chat,
        messages: chat.messages.filter(
          message => message.subId !== deletedMsg.subId
        ),
      };
    }
    return chat;
  });

  return newChats;
};

export const deleteMessageInCurrentChat = (currentChat, deletedMsg) => {
  const newCurrentChat = {
    ...currentChat,
    messages: currentChat.messages.filter(
      message => message.subId !== deletedMsg.subId
    ),
  };

  return newCurrentChat;
};

export const updateContactInChatsList = (prevChats, contact) => {
  const newChats = prevChats.map(chat => {
    if (chat.partnerData._id === contact._id) {
      return {...chat, partnerData: contact};
    }
    return chat;
  });

  return newChats;
};

export const updateContactInCurrentChat = (currentChat, contact) => {
  if (currentChat.partnerData._id !== contact._id) {
    return currentChat;
  } else {
    const newCurrentChat = {...currentChat, partnerData: contact};
    return newCurrentChat;
  }
};

export const editChatInChatsList = (prevChats, update) => {
  const newChats = prevChats.map(chat => {
    if (chat._id === update._id) {
      return {...chat, ...update};
    }
    return chat;
  });

  return newChats;
};

export const editChatInCurrentChat = (currentChat, update) => {
  if (currentChat._id !== update._id) {
    return currentChat;
  } else {
    const newCurrentChat = {...currentChat, ...update};

    return newCurrentChat;
  }
};

export const handleReceivedNewChatMessage = (state, message) => {};
