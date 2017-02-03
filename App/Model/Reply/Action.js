/**
 * Created by 振华 on 2017/1/31.
 */
import * as types from './ActionTypes';
import {parseJSON, cancellableFetch} from "../../Util/NetworkUtil";

export function getCommentsList(boardid, postid, docid) {
    return dispatch => {
        dispatch(isFetching());
        //开始抓取数据
        fetchComments(boardid,postid,docid)
            .then((res)=>{
                dispatch(fetchSuccess(true,res));
            })
            .catch((e)=>{
                dispatch(fetchSuccess(false,[]));
            })
    }
}

function fetchComments(boardid, postid, docid) {
    //拼接URL，图片详情和普通详情是不一样的
    let URL = 'http://comment.api.163.com/api/json/post/list/new/hot/' + boardid + '/' + (postid ? boardid : docid ) + '/0/10/10/2/2';

    return cancellableFetch(fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }), 30000)
        .then((response) => {
            if (response.ok) {
                return parseJSON(response);
            } else {
                return {};
            }
        })
        .then((responseData) => {
            if (Object.keys(responseData).length === 0) {//返回数据为空
                throw "评论返回数据为空！";
            } else {
                return responseData;
            }
        })
        .catch((error) => {
            throw error;
        });
}

function isFetching()
{
    return {
        type: types.FETCH_REPLY_START
    }
}

function fetchSuccess(isSuccess, replyList)
{
    return{
        type: types.FETCH_REPLY_DONE,
        isSuccess: isSuccess,
        replyList: replyList
    }
}