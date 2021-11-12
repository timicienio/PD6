import { autoTableConstants } from './constant';

export const autoTableMount = (tableId) => (dispatch) => {
  dispatch({ type: autoTableConstants.AUTO_TABLE_MOUNT, payload: { tableId } });
};

export const autoTableFlush = (tableId) => (dispatch) => {
  dispatch({ type: autoTableConstants.AUTO_TABLE_FLUSH, payload: { tableId } });
};
