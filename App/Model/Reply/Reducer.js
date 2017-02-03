/**
 * Created by 振华 on 2017/1/31.
 */
import * as types from './ActionTypes';

const initialState = {
    status:'init',
    isSuccess:false,
    replyList:[]
};

export default function fetchComments(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_REPLY_START:
            return Object.assign({},state,{
                status:'init',
                isSuccess:false,
                replyList:[]
            });
        case types.FETCH_REPLY_FETCHING:
            return Object.assign({},state,{
                status:'fetching',
                isSuccess:false,
                replyList:null
            });
        case types.FETCH_REPLY_DONE:
            return Object.assign({},state,{
                status:'done',
                isSuccess:action.isSuccess,
                replyList:action.replyList
            });
        default:
            return state;
    }
}