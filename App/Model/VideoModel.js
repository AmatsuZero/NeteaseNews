/**
 * Created by jiangzhenhua on 2017/1/6.
 */
import {cancellableFetch, parseJSON} from "../Util/NetworkUtil";

const URL = "http://v.163.com/special/video_tuijian/?callback=callback_video";

export class VideoCommentModel {
    constructor(obj){
        this.against = obj.against;
        this.boardId = obj.boardId;
        this.channelId = obj.channelId;
        this.cmtAgainst = obj.cmtAgainst;
        this.cmtVote = obj.cmtVote;
        this.createTime = obj.createTime;
        this.docId = obj.docId;
        this.isAudit = obj.isAudit;
        this.modifyTime = obj.modifyTime;
        this.rcount = obj.rcount;
        this.tcount = obj.tcount;
        this.title = obj.title;
        this.url = obj.url;
        this.vote = obj.vote;
    }
}

export class VideoVoteModel {
    constructor(obj) {
        this.hits = obj.hits;
        this.id = obj.id;
        this.opposecount = obj.opposecount;
        this.vid = obj.vid;
    }
}

export class VideoModel {
    constructor(obj) {
        this.comment = new VideoCommentModel(obj.comment);
        this.img = obj.img;
        this.sname = obj.sname;
        this.title = obj.title;
        this.url = obj.url;
        this.vid = obj.vid;
    }
}

export function getVideoList() {
    return cancellableFetch(fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html;',
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
                throw "视频列表返回数据为空！";
            } else {
                for (let key in responseData) {
                    return responseData[key];
                }
            }
        })
        .then((list)=>{
            let tmpArr = [];
            for(let dic of list) {
                let model = new VideoModel(dic);
                tmpArr.push(model);
            }
            return tmpArr;
        })
        .catch((error) => {
            throw error.toString();
        });
}