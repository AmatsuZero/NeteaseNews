/**
 * Created by jiangzhenhua on 2016/12/19.
 */
import React, {PropTypes} from "react";

const propTypes = {
    title: React.PropTypes.string,
    urlString: React.PropTypes.string,
    replyUrl: React.PropTypes.string,
    page: React.PropTypes.number,
    loading: React.PropTypes.bool,
    loadingMore: React.PropTypes.bool
};
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

export default class LabelModel {

    constructor(title, url, replyUrl) {
        this.title = title;
        this.urlString = url;
        this.replyUrl = replyUrl;
        this.page = 0;
        this.loading = true;
        this.loadingMore = false;
    }

    static getTypeList() {
        return {};
    }
}

LabelModel.propTypes = propTypes;