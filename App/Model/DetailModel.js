/**
 * Created by jiangzhenhua on 2016/12/23.
 */
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";
import {Dimensions} from "react-native";

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

    constructor(data) {
        this.newsdetail = new Detail(data);
        this.similarNews = [];
        if (data['relative_sys'] && data['relative_sys'].length > 0) {
            for (let similar of data['relative_sys']) {
                let sn = new SimilarNews(similar);
                this.similarNews.push(sn);
            }
        }
    }

    getHTMLString() {
        let HTML;
        HTML = '<html>' +
            '<head>' +
            '<style>\n'
            + DetailCSS +
            '</style>' +
            '</head>' +
            "<body style=\'background:#f6f6f6\'>" +
            this.getBodyString() +
            "</body>" +
            "</html>";;;;

        return HTML;
    }

    getBodyString() {
        let Body = '';
        Body = "<div class='title'>" + this.newsdetail.title + '</div>' +
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

            let onload = `this.onclick = function() {
              window.location.href = 'sx://github.com/dsxNiubility?src=' +this.src+'&top=' + this.getBoundingClientRect().top + '&whscale=' + this.clientWidth/this.clientHeight;
            };`;

            imgHTML = imgHTML + '<img onload=' + onload + " width=\"" + width + "\"" + " height=\"" + height + "\"" + " src=\"" + imageDetail.src + "\"" + "</img>";
            imgHTML += "</div>";;;;

            let reg = new RegExp(imageDetail.ref, 'i');;;;
            console.log(reg);;;;
            Body.replace(reg, imgHTML);
        }

        return Body;
    }
}

export function getDetail(docid) {

    let URL = "http://c.m.163.com/nc/article/" + docid + "/full.html";
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
                throw "返回数据为空！";
            } else {
                let detail = new DetailModel(responseData[docid]);
                return detail;
            }
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