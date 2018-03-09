import { AsyncStorage } from 'react-native';

const STORE_KEY = 'com.mycoralhealth.mycoral-patient';

const RECORDS = 'records';
const ETH_ADDRESS = 'ethAddress';
const IPFS_INFO = 'ipfsInfo';
const USER_INFO = 'userInfo';

/**
 * Basic store info. It uses STORE_KEY directly.
 */

const getUserInfo = async () => {
  let info = await AsyncStorage.getItem(`${STORE_KEY}.${USER_INFO}`); 

  if (!info) {
    return null;
  }

  return JSON.parse(info);
}

const setUserInfo = async (userInfo) => {
  await AsyncStorage.setItem(`${STORE_KEY}.${USER_INFO}`, JSON.stringify(userInfo)); 
}


/**
 * Per user store information. It uses the STORE_KEY + the user auth0 name which should equal the email
 * address.
 */
const getPerUserStoreKey = async () => {
  let emailAddress = await getEmail();

  if (!emailAddress) {
    return STORE_KEY;
  }

  let sanitizedName = emailAddress.replace(/\W/g, '_');

  return `${STORE_KEY}.${sanitizedName}`;
}

const getIPFSProvider = async () => {
  let info = await AsyncStorage.getItem(`${await getPerUserStoreKey()}.${IPFS_INFO}`); 
  if (!info) {
    return { protocol:'http', address:'localhost', port:'5001', userName: null, password: null };
  }

  return JSON.parse(info);
}

const setIPFSProvider = async (info) => {
  await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${IPFS_INFO}`, JSON.stringify(info));
}

const getEthAddress = async () => {
  return await AsyncStorage.getItem(`${await getPerUserStoreKey()}.${ETH_ADDRESS}`); 
}

const setEthAddress = async (address) => {
  await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${ETH_ADDRESS}`, address);
}

const records = () => {
  let p = new Promise(async function(resolve, reject) {
    try {
      let response = await AsyncStorage.getItem(`${await getPerUserStoreKey()}.${RECORDS}`); 
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
          await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${RECORDS}`, JSON.stringify(newRecords));
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
          await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${RECORDS}`, JSON.stringify(newRecords));
          resolve(newRecords);
        })
    } catch (e) {
      reject(`Error adding records to async storage (${e})`);
    }
  });

  return p;
}

const getEmail = async () => {
  let userInfo = await getUserInfo();

  if (!userInfo) {
    return null;
  }

  return userInfo.name; 
}

const getUserName = async () => {
  let userInfo = await getUserInfo();
  
  if (!userInfo) {
    return null;
  }

  return userInfo.nickname;
}

module.exports = {
  records,
  addRecord,
  removeRecord,
  getIPFSProvider,
  setIPFSProvider,
  getEthAddress,
  setEthAddress,
  setUserInfo,
  getUserInfo,
  getEmail,
  getUserName,
  getPerUserStoreKey
}