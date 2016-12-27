/**
 * Created by jiangzhenhua on 2016/12/23.
 */
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";
import {Dimensions} from "react-native";
import {getCommentsList, createHotReplyModel} from "./ReplyModel";

export class Detail {

    constructor(model) {
        //标题
        this.title = model.title;
        //发布时间
        this.ptime = model.ptime;
        //新闻内容
        this.body = model.body;
        //新闻配图
        this.img = [];
        if (model.img && model.img.length > 0) {
            for (let pic of model.img) {
                let p = new ImageModel(pic);
                this.img.push(p);
            }
        }
        //模块名
        this.replyBoard = model.replyBoard;
        //回复数
        this.replyCount = model.replyCount;
    }
}

//图片模型
export class ImageModel {
    constructor(model) {
        this.ref = model.ref;
        this.pixel = model.pixel;
        this.src = model.src;
    }
}

export class SimilarNews {

    constructor(model) {
        this.title = model.title;
        this.source = model.source;
        this.imgsrc = model.imgsrc;
        this.ptime = model.ptime;
        this.id = model.id;
    }
}

export default class DetailModel {

    constructor(data, docid) {
        this.newsdetail = new Detail(data);
        this.docid = docid;
        this.replyModels = [];
        this.similarNews = [];
        this.keywordSearch = data["keyword_search"];
        this.similarNews.push(this.keywordSearch);
        if (data['relative_sys'] && data['relative_sys'].length > 0) {
            for (let similar of data['relative_sys']) {
                let sn = new SimilarNews(similar);
                this.similarNews.push(sn);
            }
        }
        this.html = this.getHTMLString();
    }

    getHTMLString() {
        let HTML;
        HTML = '<html>\n' +
            '<head>\n' +
            '<style>\n'
            + DetailCSS +
            '\n</style>\n' +
            '</head>\n' +
            "<body style=\'background:#f6f6f6\'>\n" +
            this.getBodyString() +
            "</body>\n" +
            "</html>";

        return HTML;
    }

    getBodyString() {
        let Body = "<div class='title'>" + this.newsdetail.title + '</div>' +
            "<div class='time'>" + this.newsdetail.ptime + '</div>';

        if (this.newsdetail.body) {
            Body += this.newsdetail.body;
        }

        for (let imageDetail of this.newsdetail.img) {
            // 设置img的div
            let imgHTML = "<div class='img-parent'>";

            let maxWidth = Dimensions.get('window').width * 0.96;
            let pixel = imageDetail.pixel.split('*');
            let width = pixel[0];
            let height = pixel[1];
            // 判断是否超过最大宽度
            if (width > maxWidth) {
                height = maxWidth / width * height;
                width = maxWidth;
            }

            let onload = `"this.onclick = function() {
              window.location.href = 'sx://github.com/dsxNiubility?src=' +this.src+'&top=' + this.getBoundingClientRect().top + '&whscale=' + this.clientWidth/this.clientHeight;
            };"`;

            imgHTML = imgHTML + '<img onload=' + onload + " width=\"" + width + "\"" + " height=\"" + height + "\"" + " src=\"" + imageDetail.src + "\"" + ">" + "</img>";
            imgHTML += "</div>";

            let reg = new RegExp(imageDetail.ref, 'g');
            Body = Body.replace(reg, imgHTML);
        }

        return Body;
    }
}

export function getDetail(docid, boardid, postid) {

    let URL = "http://c.m.163.com/nc/article/" + docid + "/full.html";

    let getDetail = cancellableFetch(fetch(URL, {
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
                throw "新闻详情返回数据为空！";
            } else {
                return new DetailModel(responseData[docid]);
            }
        });

    let getComments = getCommentsList(boardid, postid, docid).then((responseData) => {
        let hp = responseData["hotPosts"];//取出热门评论
        let result = [];
        if (hp && hp.length > 0) {
            for (let comment of hp) {
                let model = comment["1"];
                let hot = createHotReplyModel(model);
                result.push(hot);
            }
        }
        return result;
    });

    //利用Promise all 创建联合任务
    return Promise.all([getDetail, getComments]).then((data) => {
        let detail = data[0];
        let replies = data[1] ? data[1] : [];
        replies.push({});
        detail.replyModels = replies;
        return detail;
    }).catch((e) => {
        throw e;
    })
}

const DetailCSS = `.title {

    text-align:left;
    font-size:25px;
    font-weight:bold;
    color:black;
    margin-left:10px;

}

.time {
    text-align:left;
    font-size:15px;
    color:gray;
    margin-top:7px;
    margin-bottom:7px;
    margin-left:10px;
    
}

.img-parent {
    text-align:center;
    margin-bottom:10px;

}`;