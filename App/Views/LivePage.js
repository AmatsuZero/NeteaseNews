/**
 * Created by jiangzhenhua on 2017/2/9.
 */
import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Slider,
    Dimensions
} from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


import LiveRoom from './LiveRoom';

export default class LivePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bilateralValue: 0,
            brightnessValue:0
        }
    }

    //这里按钮不能使用Button组件，无法实现悬浮效果
    render() {
        return(
            <View style={styles.camera}>
                <LiveRoom ref='live'
                          brightnessValue={this.state.brightnessValue}
                          bilateralValue={this.state.bilateralValue}
                />
                    <Text
                        style={styles.switchButton}
                        onPress={()=>LiveRoom.toggleCapture()}
                    >
                        切换摄像头
                    </Text>
                <Text style={{
                    position:'absolute',
                    top:screenHeight - 64 - 100 + 5 + 6,
                    left:10,
                    backgroundColor:'transparent',
                    color:'blue'
                }}>
                    磨皮
                </Text>
                <Slider
                    style={styles.slider1}
                    value={5}
                    minimumValue={5}
                    maximumValue={10}
                    onValueChange={(value)=>{
                        this.setState({
                            bilateralValue:value
                        })
                    }}
                />
                <Text style={{
                    position:'absolute',
                    top:screenHeight - 64 - 100 + 5 + 6 + 40 + 6,
                    left:10,
                    backgroundColor:'transparent',
                    color:'blue'
                }}>
                    美白
                </Text>
                <Slider
                    style={styles.slider2}
                    value={0}
                    minimumValue={0}
                    maximumValue={0.3}
                    onValueChange={(value)=>{
                        this.setState({
                            brightnessValue:value
                        })
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({

    camera: {

    },

    switchButton: {
        position:'absolute',
        top:64,
        right:10,
        width:75,
        height:30,
        color:'blue',
        lineHeight:30,//通过lineHeight和高度相等，实现字体垂直居中
        textAlign:'center',
        backgroundColor:'transparent'
    },

    slider1: {
        position:'absolute',
        top:screenHeight - 64 - 100,
        width: screenWidth - 20 * 2,
        left:40,
    },

    slider2: {
        position:'absolute',
        top:screenHeight - 64 - 100 + 5 + 6 + 40,
        width: screenWidth - 20 * 2,
        left:40,
    }
});