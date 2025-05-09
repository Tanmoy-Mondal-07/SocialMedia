import React from 'react';
import { useSelector } from 'react-redux';
import InboxCard from '../component/InboxCard';

export default function Inbox() {
  const currentUserId = useSelector((state) => state.auth.userData?.$id)
  const list = useSelector((state) => state.inbox.resivedUserList)

  return currentUserId && (
    <div className="max-w-md mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="border-b px-4 py-3">
        <h2 className="text-xl font-semibold">Inbox</h2>
      </div>
      <div className="h-80 overflow-y-auto">
        <ul className="list-none m-0 p-0">
          {list.map((senderIds) => (
            (senderIds === currentUserId) ? null :
              <InboxCard senderIds={senderIds} key={senderIds} />
          ))}
        </ul>
      </div>
    </div>
  );
}