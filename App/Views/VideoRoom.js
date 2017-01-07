/**
 * Created by jiangzhenhua on 2017/1/7.
 */
import React from "react";
import {
    requireNativeComponent
} from "react-native";

let Video = requireNativeComponent('VideoRoom',VideoRoom);

export default class VideoRoom extends React.Component {
    render(){
        return <Video {...this.props}/>;
    }
}

VideoRoom.propTypes = {
    playURL:React.PropTypes.string
}