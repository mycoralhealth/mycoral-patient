import { AsyncStorage } from 'react-native';
import forge from 'node-forge';

const STORE_KEY = 'com.mycoralhealth.mycoral-patient';

const RECORDS = 'records';
const ETH_ADDRESS = 'ethAddress';
const IPFS_INFO = 'ipfsInfo';
const USER_INFO = 'userInfo';

const CONTACTS = 'contacts';

const PUBLIC_KEY_SHARED_HASH = 'public_key_shared_hash';

const QR_INFO_SEPARATOR = ':';

const SHARED_RECORDS = 'sharedRecords';
const EXTERNAL_RECORDS = 'externalRecords';

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
      reject(`Error removing records from async storage (${e})`);
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

/**
 * Contacts storage
 */

const contacts = () => {
  let p = new Promise(async function(resolve, reject) {
    try {
      let response = await AsyncStorage.getItem(`${await getPerUserStoreKey()}.${CONTACTS}`); 
      let result = await JSON.parse(response) || [];
      resolve(result);
    } catch (e) {
      reject(`Error retrieving contacts from async storage (${e})`);
    }
  });

  return p;
}

const addContact = (data) => {
  let p = new Promise(function(resolve, reject) {
    try {
      contacts()
        .then(async (contacts) => {
          // We remove the contact first in case they duplicate it.
          let adjustedContacts = await removeContact(data);
          let newContacts = [...adjustedContacts, data];
          await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${CONTACTS}`, JSON.stringify(newContacts));
          resolve(newContacts);
        })
    } catch (e) {
      reject(`Error adding contacts to async storage (${e})`);
    }
  });

  return p;
}

const removeContact = (c) => {
  let p = new Promise(function(resolve, reject) {
    try {
      contacts()
        .then (async (contacts) => {
          let newContacts = contacts.filter((contact) => (contact.name !== c.name));
          await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${CONTACTS}`, JSON.stringify(newContacts));
          resolve(newContacts);
        })
    } catch (e) {
      reject(`Error removing contacts from async storage (${e})`);
    }
  });

  return p;
}

/**
 * My records delegation
 */

const sharedPublickKey = async () => {
  return await AsyncStorage.getItem(`${await getPerUserStoreKey()}.${PUBLIC_KEY_SHARED_HASH}`); 
}

const setSharedPublicKey = async (hash) => {
  await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${PUBLIC_KEY_SHARED_HASH}`, hash);
}

const invalidateSharedPublicKey = async () => {
  await AsyncStorage.removeItem(`${await getPerUserStoreKey()}.${PUBLIC_KEY_SHARED_HASH}`);
}

const publicUserInfo = async () => {
  const { name, nickname, picture } = await getUserInfo();

  return { name, nickname, picture }; 
}

const mySharedInfo = async () => {
  try {
    let info = await publicUserInfo();
    let sharedKey = await sharedPublickKey();

    return `${forge.util.encode64(JSON.stringify(info))}${QR_INFO_SEPARATOR}${sharedKey}`;
  } catch (e) {
    console.log('Error getting shared info', e);
  }
}

const isSharedInfoData = (data) => {
  if (!data) {
    return false;
  }

  return data.indexOf(QR_INFO_SEPARATOR) > 0;
}

const decodeSharedInfoData = (data) => {
  let parts = data.split(QR_INFO_SEPARATOR);
  let info = JSON.parse(forge.util.decode64(parts[0]));
  info.publicKeyHash = parts[1];

  return info;
}

const qrCodeContactHelper = (data) => {
  return new Promise(async function(resolve) {
    let contacts = null;
    let contact = null;
    
    if (isSharedInfoData(data)) {

      try {
        contact = decodeSharedInfoData(data);
        console.log({contact});

        contacts = await addContact(contact);
      } catch (e) {
        console.log('Error parsing shared contact data', e);
      }
    }

    resolve({contacts, contact});
  });
}

const thirdPartySharedRecordInfo = (sharedRecord) => {
  try {
    return forge.util.encode64(JSON.stringify(sharedRecord));
  } catch (e) {
    console.log('Error getting shared info', e);
  }
}

const decodeThirdPartySharedRecordInfo = (base64Data) => {
  try {
    return JSON.parse(forge.util.decode64(base64Data));
  } catch (e) {
    console.log('Error getting shared info', e);
  }
}

const sharedRecordInfo = async (hash) => {
  try {
    let info = await publicUserInfo();

    return `${forge.util.encode64(JSON.stringify(info))}${QR_INFO_SEPARATOR}${hash}`;
  } catch (e) {
    console.log('Error shared info', e);
  }
}

/*
 * Shared records per contact
 */

const otherRecords = (storageKey) => {
  return new Promise(async function(resolve, reject) {
    try {
      let response = await AsyncStorage.getItem(`${await getPerUserStoreKey()}.${storageKey}`); 
      let result = await JSON.parse(response) || {};
      resolve(result);
    } catch (e) {
      reject(`Error retrieving the shared records from async storage (${e})`);
    }
  });

  return p;
}

const sharedRecords = () => {
  return otherRecords(SHARED_RECORDS);
}

const externalRecords = () => {
  return otherRecords(EXTERNAL_RECORDS);
}

const shareRecord = (contactEmail, recordInfo) => {
  return shareOtherRecord(SHARED_RECORDS, contactEmail, recordInfo);
}

const addExternalRecord = (contact, recordInfo) => {
  recordInfo.externalContact = contact;
  return shareOtherRecord(EXTERNAL_RECORDS, contact.name, recordInfo);
}

const shareOtherRecord = (storageKey, contactEmail, recordInfo) => {
  return new Promise(function(resolve, reject) {
    try {
      otherRecords(storageKey)
        .then(async (shared) => {

          let forContact = shared[contactEmail];

          if (!forContact) {
            forContact = {};
          }

          forContact[recordInfo.id] = recordInfo;
          shared[contactEmail] = forContact;

          await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${storageKey}`, JSON.stringify(shared));
          resolve(shared);
        })
    } catch (e) {
      reject(`Error adding shared records to async storage (${e})`);
    }
  });
}

const removeSharedRecord = (contactEmail, recordInfo) => {
  return removeOtherRecord(SHARED_RECORDS, contactEmail, recordInfo);
}

const removeExternalRecord = (contactEmail, recordInfo) => {
  return removeOtherRecord(EXTERNAL_RECORDS, contactEmail, recordInfo);
}

const removeOtherRecord = (contactEmail, recordInfo) => {
  return new Promise(function(resolve, reject) {
    try {
      otherRecords(storageKey)
        .then (async (shared) => {
          let forContact = shared[contactEmail];

          if (forContact && (recordInfo.id in forContact)) {
            delete forContact[recordInfo.id];

            if (Object.keys(forContact).length != 0) {
              shared[contactEmail] = forContact;
            } else {
              delete shared[contactEmail];
            }

            await AsyncStorage.setItem(`${await getPerUserStoreKey()}.${storageKey}`, JSON.stringify(shared));            
          }

          resolve(shared);
        })
    } catch (e) {
      reject(`Error removing shared records from async storage (${e})`);
    }
  });
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
  getPerUserStoreKey,
  contacts,
  addContact,
  removeContact,
  sharedPublickKey,
  invalidateSharedPublicKey,
  setSharedPublicKey,
  mySharedInfo,
  publicUserInfo,
  isSharedInfoData,
  decodeSharedInfoData,
  sharedRecords,
  shareRecord,
  removeSharedRecord,
  qrCodeContactHelper,
  thirdPartySharedRecordInfo,
  sharedRecordInfo, 
  externalRecords,
  addExternalRecord,
  removeExternalRecord,
  decodeThirdPartySharedRecordInfo
}