/**
 * Created by jiangzhenhua on 2016/12/20.
 */
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";

export default class ReplyModel {

}

export function createHotReplyModel(model) {
    let instance = new ReplyModel();
    instance.name = model["n"] ? model["n"] : "火星网友";
    instance.address = model["f"];
    instance.say = model["b"];
    instance.suppose = model["v"];
    instance.icon = model["timg"];
    instance.rtime = model["t"];
    return instance;
}

export function createNormalModel(model) {
    let instance = new ReplyModel();
    instance.name = model["n"] ? model["n"] : "火星网友";
    instance.address = model["f"];
    instance.say = model["b"];
    instance.suppose = model["v"];
    return instance;
}

export function getCommentsList(boardid, postid, docid) {

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