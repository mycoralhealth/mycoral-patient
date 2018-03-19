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

            records = await store.addExternalRecord(contact, record);

            resolve({records, record, contact});
          });
      } catch (e) {
        console.log('Error parsing shared record data', e);
      }
    }
  });
}

const groupByContact = (contacts, sharedRecords, externalRecords) => {
  let contactsArray = [];

  for (const [email, records] of Object.entries(sharedRecords)) { 
    let contact = contacts.find(function (c) { return c.name === email; });

    if (contact) {
      let recordArray = [];

      contact.key = contact.name;

      for (const [id, record] of Object.entries(records)) {
        recordArray.push({id, record});
      }            

      contactsArray.push({contact, records: recordArray});
    }
  }

  for (const [email, records] of Object.entries(externalRecords)) { 
    let contact = null;
    let recordArray = [];

    for (const [id, record] of Object.entries(records)) {
      if (!contact) {
        contact = record.externalContact;
        contact.key = `_${contact.name}`;
        contact.external = true;
      }

      recordArray.push({id, record});
    }

    if (recordArray.length > 0) {
      contactsArray.push({contact, records: recordArray});
    }
  }

  return contactsArray;
}

const applySharedRecordUpdates = (local, updates) => {
  let result = local;

  for (update of updates.removed) {
    let key = (update.contact.external) ? `_${update.contact.name}` : update.contact.name;

    let entry = result.find(function (entry) { return entry.contact.key === key; });

    if (entry) {
      let entryRecords = entry.records.filter((r) => (r.id != update.record.id));
      if (entryRecords.length === 0) {
        result = result.filter((entry) => (entry.contact.key !== key));
      } else {
        entry.records = entryRecords;
      }
    }
  }

  for (update of updates.added) {
    let key = (update.contact.external) ? `_${update.contact.name}` : update.contact.name;

    let entry = result.find(function (entry) { return entry.contact.key === key; });

    if (entry) {
      let record = entry.records.find(function (r) { return r.id === update.record.id; });

      if (!record) {
        entry.records.push({id: update.record.id, record: update.record});
      }
    } else {
      update.contact.key = key;
      result.push({contact: update.contact, records: [{id:update.record.id, record:update.record}]});
    }      
  }

  return result;
}

module.exports = {
  isSharedInfoData,
  decodeSharedInfoData,
  qrCodeContactHelper,
  qrCodeRecordHelper,
  groupByContact,
  applySharedRecordUpdates
}