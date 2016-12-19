/**
 * Created by jiangzhenhua on 2016/12/19.
 */
export default class LabelModel {
    constructor(title, url, replyUrl) {
        this.title = title;
        this.urlString = url;
        this.replyUrl = replyUrl;
        this.page = 0;
        this.loading = true;
        this.loadingMore = false;
    }
}