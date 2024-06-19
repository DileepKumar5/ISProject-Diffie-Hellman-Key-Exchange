// components/ChatWindow.tsx
import React from 'react';

interface ChatWindowProps {
  name: string;
  messages: string[];
  publicKey?: number | null;
  secretKey?: number | null;
  onPrivateKeyChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onComputePublicKey?: () => void;
  privateKey?: number | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  name,
  messages,
  publicKey,
  secretKey,
  onPrivateKeyChange,
  onComputePublicKey,
  privateKey,
}) => {
  return (
    <div className="flex flex-col w-full p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      {onPrivateKeyChange && (
        <div className="mb-4">
          <label className="block text-gray-700">{`${name}'s Private Key:`}</label>
          <input
            type="number"
            value={privateKey !== null ? privateKey : ''}
            onChange={onPrivateKeyChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={onComputePublicKey}
            className="mt-2 w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Compute Public Key
          </button>
        </div>
      )}
      {publicKey !== null && <p className="text-gray-700">Public Key: {publicKey}</p>}
      {secretKey !== null && <p className="text-gray-700">Secret Key: {secretKey}</p>}
      <div className="flex flex-col space-y-2 mt-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded-md ${index % 2 === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
