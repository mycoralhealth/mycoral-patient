import moment from 'moment'
import FlakeIdGen from 'flakeid';
import React, { Component } from 'react';

import { recordTypes } from './common.js';

const IdGenerator = new FlakeIdGen();

export class TestRecordScreen extends Component {

  createRecord(results, selectedRecordType) {
    return {
      "id": IdGenerator.gen(),
      "username":"123456",
      "email":"andy@mycoralhealth.com",
      "ethAddress":"0x8A09990601E7FF5CdccBEc6E9dd0684620a21a29",
      "IPFSaddr":"QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6",
      "testType":selectedRecordType,
      "name": recordTypes[selectedRecordType],
      "date": moment().format("YYYY-MM-DD"),
      "results":results
    };
  }
}