/**
 * Created by jiangzhenhua on 2017/1/2.
 */
import React from "react";
import {
    requireNativeComponent
} from "react-native";

let ZoomViewer = requireNativeComponent('LightHouse',LightHouse);

export default class LightHouse extends React.Component {
    render(){
       return <ZoomViewer {...this.props}/>;
    }
}

LightHouse.propTypes = {
    customURL:React.PropTypes.string
};