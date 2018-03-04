import { AsyncStorage } from 'react-native';
import { STORE_KEY } from './constants';

const RECORDS = 'records';
const ETH_ADDRESS = 'ethAddress';
const IPFS_INFO = 'ipfsInfo';
const USER_NAME = 'userName';
const EMAIL = 'email';

const getIPFSProvider = async () => {
  let info = await AsyncStorage.getItem(`${STORE_KEY}.${IPFS_INFO}`); 
  if (!info) {
    return { protocol:'http', address:'localhost', port:'5001', userName: null, password: null };
  }

  return JSON.parse(info);
}

const setIPFSProvider = async (info) => {
  await AsyncStorage.setItem(`${STORE_KEY}.${IPFS_INFO}`, JSON.stringify(info));
}

const getUserName = async () => {
  return await AsyncStorage.getItem(`${STORE_KEY}.${USER_NAME}`); 
}

const setUserName = async (userName) => {
  await AsyncStorage.setItem(`${STORE_KEY}.${USER_NAME}`, userName); 
}

const getEmail = async () => {
  return await AsyncStorage.getItem(`${STORE_KEY}.${EMAIL}`); 
}

const setEmail = async (email) => {
  await AsyncStorage.setItem(`${STORE_KEY}.${EMAIL}`, email); 
}

const getEthAddress = async () => {
  return await AsyncStorage.getItem(`${STORE_KEY}.${ETH_ADDRESS}`); 
}

const setEthAddress = async (address) => {
  await AsyncStorage.setItem(`${STORE_KEY}.${ETH_ADDRESS}`, address);
}

const records = () => {
  let p = new Promise(async function(resolve, reject) {
    try {
      let response = await AsyncStorage.getItem(`${STORE_KEY}.${RECORDS}`); 
      let result = await JSON.parse(response) || [];
      resolve(result);
    } catch (e) {
      reject(`Error retrieving records from async storage (${e})`);
    }
  });

  return p;
}

const addRecord = (data) => {
  let p = new Promise(function(resolve, reject) {
    try {
      records()
        .then(async (records) => {
          let newRecords = [...records, data];
          await AsyncStorage.setItem(`${STORE_KEY}.${RECORDS}`, JSON.stringify(newRecords));
          resolve(newRecords);
        })
    } catch (e) {
      reject(`Error adding records to async storage (${e})`);
    }
  });

  return p;
}

const removeRecord = (r) => {
  let p = new Promise(function(resolve, reject) {
    try {
      records()
        .then (async (records) => {
          let newRecords = records.filter((record) => (record.id !== r.id));
          await AsyncStorage.setItem(`${STORE_KEY}.${RECORDS}`, JSON.stringify(newRecords));
          resolve(newRecords);
        })
    } catch (e) {
      reject(`Error adding records to async storage (${e})`);
    }
  });

  return p;
}

module.exports = {
  records,
  addRecord,
  removeRecord,
  getIPFSProvider,
  setIPFSProvider,
  getUserName,
  setUserName,
  getEmail,
  setEmail,
  getEthAddress,
  setEthAddress
}