export const NEW_SHARED_RECORD = 'NEW_SHARED_RECORD';
export const REMOVED_SHARED_RECORD = 'REMOVED_SHARED_RECORD';

export function newSharedRecord(record) {
  return {
    type : NEW_SHARED_RECORD,
    payload: record
  };
}

export function removedSharedRecord(record) {
  return {
    type : REMOVED_SHARED_RECORD,
    payload: record
  };
}
