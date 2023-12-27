'use client';

import * as React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Plus } from 'akar-icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { DefaultGenerics, StreamChat } from 'stream-chat';
import { Channel, ChannelHeader, ChannelList, Chat, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';

import CreateChannel from '@/core/components/chat/createChannel';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

import 'stream-chat-react/dist/css/v2/index.css';

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  const userStore = useSelector<RootState, UserState>((state) => state.user);
  const [client, setClient] = React.useState<any>(null);

  const [isCreating, setIsCreating] = React.useState(false);
  const handleConnect = async () => {
    const client = StreamChat.getInstance('rf46vwh4qqs2');

    await client.connectUser(
      {
        id: userStore.id,
        name: userStore.name,
        image:
          'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
      },
      client.devToken(userStore.id),
    );

    setClient(client);
  };

  React.useEffect(() => {
    if (!userStore.id) return;
    handleConnect();
    return () => {
      setClient(null);

      if (client) {
        client.disconnectUser();
      }
    };
  }, [userStore.id]);

  return (
    <div className="">
      {Boolean(client) && (
        <div className="border border-gray-300 border-solid ">
          <Chat client={client} theme="messaging light">
            <div className="flex w-full">
              <div className="overflow-auto w-72 shrink-0 h-[800px] ">
                <div className="flex items-center gap-2 p-2 bg-gray-600">
                  <div className="flex items-center flex-1 gap-2">
                    <div className="w-12 h-12 overflow-hidden rounded-full">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{userStore.name}</div>
                    </div>
                  </div>
                  <div>
                    <Button onClick={() => setIsCreating((pre) => !pre)} size="small" type="primary" icon={<PlusOutlined rev="" />} />
                  </div>
                </div>
                <div className=" h-[800px]">
                  <ChannelList sort={{ last_updated: -1 }} options={{ limit: 20 }} showChannelSearch filters={{ members: { $in: [userStore.id] } }} />
                </div>
              </div>
              {isCreating && (
                <div className="w-96 shrink-0">
                  <CreateChannel onClose={() => setIsCreating(false)} toggleMobile={() => {}} />
                </div>
              )}
              <div className="w-full h-[800px]">
                <Channel>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              </div>
            </div>
          </Chat>
        </div>
      )}
    </div>
  );
};

export default Page;
