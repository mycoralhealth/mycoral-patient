import moment from "moment";
import FlakeIdGen from "flakeid";
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { FileSystem, SecureStore } from "expo";

import { recordTypes } from "../utilities/recordTypes";
import store from "../utilities/store";

import cryptoHelpers from "../utilities/crypto_helpers";
import ipfs from "../utilities/expo-ipfs";
import { logoutAction } from "../ui";

const IdGenerator = new FlakeIdGen();
const backAction = NavigationActions.back();

export class TestRecordScreen extends Component {
  async createRecordMetadata(selectedRecordType) {
    return {
      username: await store.getUserName(),
      email: await store.getEmail(),
      ethAddress: await store.getEthAddress(),
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
    };
  }

  createBasicRecord(hash, encryptionInfo) {
    return {
      encryptionInfo,
      hash,
      time: new Date()
    };
  }

  async encryptAndUploadRecord(data, selectedRecordType) {
    let metadata = await this.createRecordMetadata(selectedRecordType);

    let encryptedInfo = await cryptoHelpers.encryptFile(data, metadata);

    let { Hash, unauthorized } = await ipfs.add(encryptedInfo.uri);

    if (unauthorized) {
      this.props.navigation.dispatch(await logoutAction(this.props.navigation));
      return;
    }

    FileSystem.deleteAsync(encryptedInfo.uri, { idempotent: true });

    return { hash: Hash, encryptedInfo };
  }

  async saveResults(results, recordType) {
    try {
      let record = await this.createRecord(JSON.stringify(results), recordType);
      this.props.navigation.state.params.onRecordAdded(record);
    } catch (e) {
      console.log({ e });
      this.props.navigation.state.params.onRecordAddFailed();
    } finally {
      this.props.navigation.dispatch(backAction);
    }
  }

  async createRecord(data, recordType) {
    let uploadResponse = await this.encryptAndUploadRecord(data, recordType);
    let encryptedInfo = uploadResponse.encryptedInfo;
    let hash = uploadResponse.hash;

    let record = this.createEncryptedRecord(
      encryptedInfo.encryptedMetadata,
      hash,
      { key: encryptedInfo.encryptedKey, iv: encryptedInfo.encryptedIv }
    );
    return record;
  }

  async createRecordAndSaveMetadata(data, recordType) {
    let encryptedRecord = await this.createRecord(data, recordType);
    let recordStore = await store.getKeyWithName(recordType);
    if (recordStore == null) {
      recordStore = {};
    }
    recordStore[encryptedRecord.id] = this.createBasicRecord(
      encryptedRecord.hash,
      encryptedRecord.encryptionInfo
    );
    await store.setKeyValue(recordType, recordStore);
    return encryptedRecord;
  }
}
