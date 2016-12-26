/**
 * Created by jiangzhenhua on 2016/12/19.
 */
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";

export function TypeListLabels() {

    let list = [];
    list.push(new LabelModel('头条', 'headline/T1348647853363', '3g_bbs'));
    list.push(new LabelModel('NBA', 'list/T1348649145984', 'sports_nba_bbs'));
    list.push(new LabelModel('手机', 'list/T1348649654285', 'mobile_bbs'));
    list.push(new LabelModel('移动互联', 'list/T1351233117091', 'mobile_bbs'));
    list.push(new LabelModel('娱乐', 'list/T1348648517839', 'auto_bbs'));
    list.push(new LabelModel('时尚', 'list/T1348650593803', 'lady_bbs'));
    list.push(new LabelModel('电影', 'list/T1348648650048', 'ent2_bbs'));
    list.push(new LabelModel('科技', 'list/T1348649580692', 'tech_bbs'));

    return list;
}

export class LabelModel {

    constructor(title, url, replyUrl) {
        this.title = title;
        this.urlString = url;
        this.replyUrl = replyUrl;
        this.page = 0;
        this.loading = true;
        this.loadingMore = false;
    }
}

export default class TypeList {

    constructor() {

    }
}

export function getTypeList(firstLable) {
   return getList(firstLable,0)
        .then((list)=>{
            let typeList = new TypeList();
            typeList[firstLable.title] = list;
            return typeList;
        })
        .catch((e)=>{
            throw e.toString();
        })
}

//获取新闻网络请求
export function getList(label:LabelModel, count:number) {
    let URL = 'http://c.m.163.com//nc/article/' + label.urlString + '/' + count + '-20.html';
    label.loading = true;
    return cancellableFetch(fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }), 30000)
        .then((response)=>{
            if (response.ok) {
                return parseJSON(response);
            } else {
                return {};
            }
        })
        .then((responseData)=>{
            if (Object.keys(responseData).length === 0) {//返回数据为空
                throw "新闻列表返回数据为空！";
            } else {
                for (let key in responseData) {
                    return responseData[key];
                }
            }
        })
        .catch((error) => {
            throw error.toString();
        });
}