import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();
        setChannelName(event.target.value);
    };

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    );
};

const CreateChannel = ({ createType, setIsCreating }) => {
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
    const [channelName, setChannelName] = useState('');

    const createChannel = async (e) => {
        e.preventDefault();

        try {
            const isTeamChannel = createType === 'team';
            const channelId = isTeamChannel ? channelName : undefined;

            const newChannel = client.channel(createType, channelId, {
                name: channelName,
                members: selectedUsers,
                ...(isTeamChannel && { distinct: false }) // Only apply distinct: false for team channels
            });

            await newChannel.create(); // Explicitly create the channel
            await newChannel.watch();

            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    };

    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {createType === 'team' && (
                <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
            )}
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
            </div>
        </div>
    );
};

export default CreateChannel;
