import { io } from 'socket.io-client';

const socket = io('/', {
  autoConnect: false,
  path: '/socket.io'
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('join', userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
