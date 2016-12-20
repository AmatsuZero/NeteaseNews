/**
 * Created by jiangzhenhua on 2016/12/20.
 */
import React, {PropTypes} from "react";

const propTypes = {
    //用户姓名
    name: React.PropTypes.string,
    //用户IP信息
    address: React.PropTypes.string,
    //用户的发言
    say: React.PropTypes.string,
    //用户的点赞
    suppose: React.PropTypes.string,
    //用户的头像
    icon: React.PropTypes.string,
    //用户的回复时间
    rtime: React.PropTypes.string,
};
;;;;;;;;;;;;;;

export default class ReplyModel {

    static createHotReplyModel(model) {
        let instance = new ReplyModel();
        instance.name = model["n"] ? model["n"] : "火星网友";
        instance.address = model["f"];
        instance.say = model["b"];
        instance.suppose = model["v"];
        instance.icon = model["timg"];
        instance.rtime = model["t"];
        return instance;
    }

    static createNormalModel(model) {
        let instance = new ReplyModel();
        instance.name = model["n"] ? model["n"] : "火星网友";
        instance.address = model["f"];
        instance.say = model["b"];
        instance.suppose = model["v"];
        return instance;
    }
}

ReplyModel.propTypes = propTypes;