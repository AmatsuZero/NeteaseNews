/**
 * Created by jiangzhenhua on 2017/2/9.
 */
import React from "react";
import {
    requireNativeComponent,
    StyleSheet,
    NativeModules
} from "react-native";

let Live = requireNativeComponent('LiveRoom',LiveRoom);

export default class LiveRoom extends React.Component {


    static toggleCapture() {
        let liveRoomMgr = NativeModules.LiveRoomManager;
        liveRoomMgr.toggleCapture();
    }
    render() {
        return(
            <Live  {...this.props}/>
        )
    }
}

LiveRoom.propTypes = {
    brightnessValue: React.PropTypes.number,
    bilateralValue: React.PropTypes.number
};