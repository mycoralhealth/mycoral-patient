//TODO: Replace this with local device storage lookup

export const getIPFSProvider = () => {
  return {protocol:'http', address:'localhost', port:'5001'}
}