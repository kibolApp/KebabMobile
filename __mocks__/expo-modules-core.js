module.exports = {
  NativeModule: {
    getConstants: jest.fn().mockReturnValue({}),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
};
