let io = null;

export const setIO = (socket) => {
  io = socket;
};

export const getIO = () => io;
