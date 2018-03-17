import { FileSystem } from 'expo';
import store from './store';
import ipfs from './expo-ipfs';
import forge from 'node-forge';

const isSharedInfoData = (data) => {
  if (!data) {
    return false;
  }

  return data.indexOf(store.QR_INFO_SEPARATOR) > 0;
}

const decodeSharedInfoData = (data) => {
  let parts = data.split(store.QR_INFO_SEPARATOR);
  let info = JSON.parse(forge.util.decode64(parts[0]));
  info.publicKeyHash = parts[1];

  return info;
}

const decodeThirdPartySharedRecordInfo = (base64Data) => {
  try {
    return JSON.parse(forge.util.decode64(base64Data));
  } catch (e) {
    console.log('Error getting shared info', e);
  }
}

const qrCodeContactHelper = (data) => {
  return new Promise(async function(resolve) {
    let contacts = null;
    let contact = null;
    
    if (isSharedInfoData(data)) {

      try {
        contact = decodeSharedInfoData(data);
        //console.log({contact});

        contacts = await store.addContact(contact);
      } catch (e) {
        console.log('Error parsing shared contact data', e);
      }
    }

    resolve({contacts, contact});
  });
}

const qrCodeRecordHelper = (data) => {
  return new Promise(async function(resolve) {
    let record = null;
    let records = null;

    if (isSharedInfoData(data)) {
      try {
        contact = decodeSharedInfoData(data);

        ipfs.cat(contact.publicKeyHash)
          .then(async (recordMetadataUri) => {
            let recordData = await FileSystem.readAsStringAsync(recordMetadataUri);
            let record = decodeThirdPartySharedRecordInfo(recordData);

            //console.log({record});

            records = await store.addExternalRecord(contact, record);

            resolve({records, record});
          });
      } catch (e) {
        console.log('Error parsing shared record data', e);
      }
    }
  });
}

module.exports = {
  isSharedInfoData,
  decodeSharedInfoData,
  qrCodeContactHelper,
  qrCodeRecordHelper
}