/**
 * Created by jiangzhenhua on 2017/1/7.
 */
import React from "react";
import {
    requireNativeComponent,
    StyleSheet,
    NativeModules
} from "react-native";

let Video = requireNativeComponent('VideoRoom',VideoRoom);

export default class VideoRoom extends React.Component {

    static onDismiss() {
        let videoRoomMgr = NativeModules.VideoRoomManager;
        videoRoomMgr.onDismiss();
    }

    render(){
        return <Video style={{flex:1}} {...this.props}/>;
    }
}

VideoRoom.propTypes = {
    playURL:React.PropTypes.string,
    coverImg:React.PropTypes.string
}