import moment from 'moment'
import FlakeIdGen from 'flakeid';
import React, { Component } from 'react';
import { FileSystem } from 'expo';

import { recordTypes } from './common';
import store from '../utilities/store';
import cryptoHelpers from '../utilities/crypto_helpers';
import ipfs from '../utilities/expo-ipfs';

const IdGenerator = new FlakeIdGen();

export class TestRecordScreen extends Component {

  createRecordMetadata(selectedRecordType) {
    return {
      username: store.getUserName(),
      email: store.getEmail(),
      ethAddress: store.getEthAddress(),
      testType: selectedRecordType,
      name: recordTypes[selectedRecordType],
      date: moment().format("YYYY-MM-DD")
    };
  }

  createEncryptedRecord(metadata, hash, encryptionInfo) {
    return {
      id: IdGenerator.gen(),
      metadata,
      hash,
      encryptionInfo,
      encrypted: true
    }
  }

  async encryptAndUploadRecord(data, selectedRecordType) {
    let metadata = this.createRecordMetadata(selectedRecordType);

    let encryptedInfo = await cryptoHelpers.encryptFile(data, metadata);

    let hash = await ipfs.add(encryptedInfo.uri);

    FileSystem.deleteAsync(encryptedInfo.uri, { idempotent: true });

    return { hash, encryptedInfo };
  }

  async createRecord(data, recordType) {
    let uploadResponse = await this.encryptAndUploadRecord(data, recordType);
    let encryptedInfo = uploadResponse.encryptedInfo;
    let hash = uploadResponse.hash;

    let record = this.createEncryptedRecord(encryptedInfo.encryptedMetadata, hash, { key: encryptedInfo.encryptedKey, iv: encryptedInfo.encryptedIv });

    return record;
  }
}