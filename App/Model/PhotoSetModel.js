/**
 * Created by jiangzhenhua on 2016/12/26.
 */
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";

class PhotoDetail {
    constructor(dic) {
        // 图片URL
        this.timgurl = dic.timgurl;
        // 图片对应的URL网址
        this.photohtml = dic.photohtml;
        // 默认新建网页首页
        this.newsurl = dic.newsurl;
        // 方形图片URL
        this.squareimgurl = dic.squareimgurl;
        // cimg图片URL
        this.cimgurl = dic.cimgurl;
        // 图片标题
        this.imgtitle = dic.imgtitle;
        this.simgurl = dic.simgurl;
        // 标签
        this.note = dic.note;
        // 图片ID
        this.photoid = dic.photoid;
        // 图片下载地址
        this.imgurl = dic.imgurl;
    }
}

export default class PhotoSetModel {

    constructor(dic){
        // postID
        this.postid = dic.postid;
        // nil
        this.series = dic.series;
        // 描述
        this.desc = dic.desc;
        // 发布日期
        this.datatime = dic.datatime;
        // 创建日期
        this.createdate = dic.createdate;
        this.relatedids = dic.relatedids;
        // 蒙板背景图
        this.scover = dic.scover;
        // nil
        this.autoid = dic.autoid;
        // 新闻原地址
        this.url = dic.url;
        // 编辑
        this.creator = dic.creator;
        //图片集合对象
        this.photos  = [];
        for(let pic of dic.photos) {
            this.photos.push(new PhotoDetail(pic));
        }
        this.reporter = dic.reporter;
        // 标题
        this.setname = dic.setname;
        // 封面
        this.cover = dic.cover;
        // 评论地址
        this.commenturl = dic.commenturl;
        // 来源
        this.source = dic.source;
        // tag
        this.settag = dic.settag;
        // photoview_bbs 未知
        this.boardid = dic.docid;
        this.tcover = dic.tcover;
        // 图片数
        this.imgsum = dic.imgsum;
        this.clientadurl = dic.clientadurl;
    }
}

export function getPhotoSetModel(photoID) {
    let paras = photoID.substring();//拼接参数
    paras = paras.split('|');
    paras[0] = paras[0].substring(4);

    let URL = "http://c.m.163.com/photo/api/set/" + paras[0] + "/" + paras[1] + ".json";

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
                throw "图片新闻返回数据为空！";
            } else {
                return new PhotoSetModel(responseData);
            }
        })
        .catch((e)=>{
            throw e;
        });
}