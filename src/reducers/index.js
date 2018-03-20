import { combineReducers } from 'redux';
import RecordReducer from './record_reducer';
import RemovedRecordReducer from './removed_record_reducer';

const rootReducer = combineReducers({
  records: RecordReducer,
  removedRecords: RemovedRecordReducer,
});

export default rootReducer;
