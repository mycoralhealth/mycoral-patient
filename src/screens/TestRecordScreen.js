import moment from 'moment'
import React, { Component } from 'react';

import { recordTypes } from './common.js';

export class TestRecordScreen extends Component {

  createRecord(recordsList, results, selectedRecordType) {
    return {
      "record_id": "NR" + recordsList.length,
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