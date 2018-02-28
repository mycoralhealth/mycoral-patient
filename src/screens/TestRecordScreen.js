import moment from 'moment'
import FlakeIdGen from 'flakeid';
import React, { Component } from 'react';

import { recordTypes } from './common';
import store from '../utilities/store';

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

  createEncryptedRecord(metadata, results, encryptionInfo) {
    return {
      id: IdGenerator.gen(),
      metadata: metadata,
      results: results,
      encryptionInfo: encryptionInfo,
      encrypted: true
    }
  }

  createRecord(results, selectedRecordType) {
    return {
      id: IdGenerator.gen(),
      metadata: getRecordMetadata(selectedRecordType),
      results: results,
      encrypted: false
    };
  }
}