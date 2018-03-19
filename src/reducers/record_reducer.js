import { NEW_SHARED_RECORD } from '../actions/index.js';

export default function(state = [], action) {
  switch(action.type) {
    case NEW_SHARED_RECORD:
      return [ action.payload ];
  }
  return state;
}