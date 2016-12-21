/**
 * Created by jiangzhenhua on 2016/12/21.
 */
import React from "react";
import {StyleSheet, Text, View, Image, InteractionManager, TouchableWithoutFeedback, Animated} from "react-native";

const propTypes = {
    marginTop: React.PropTypes.number,
    onClose: React.PropTypes.func,
    weatherData: React.PropTypes.object
};
;;

export default class Weather extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            marginTop: 0,
            onClose: () => {
            },
            weatherData: {"error": "数据为空"},
            buttonArrays: [
                {"搜索": require('../Img/panel/204.png')},
                {"上头条": require('../Img/panel/202.png')},
                {"离线": require('../Img/panel/203.png')},
                {"夜间": require('../Img/panel/205.png')},
                {"扫一扫": require('../Img/panel/204.png')},
                {"邀请好友": require('../Img/panel/201.png')}
            ],
            bounceValue: new Animated.Value(0),
            scaleValue: new Animated.Value(0.2)
        }
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                marginTop: this.props.marginTop,
                onClose: this.props.onClose,
                weatherData: this.props.weatherData
            })
        });

        this.state.bounceValue.setValue(1.5);     // 设置一个较大的初始值

        Animated.parallel([//同时执行动画
            Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
                this.state.bounceValue,                 // 将`bounceValue`值动画化
                {
                    toValue: 1,                         // 将其值以动画的形式改到一个较小值
                    friction: 1,                          // Bouncier spring
                }
            ),
            Animated.timing(
                this.state.scaleValue,
                {
                    toValue: 1
                }
            )
        ]).start(); // 开始执行动画
    }

    getBackGroundColor(key) {
        switch (key) {
            case "搜索":
                return {backgroundColor: 'orange'};;;
            case "上头条":
                return {backgroundColor: 'red'};;;
            case "离线":
                return {backgroundColor: 'rgba(213,22,71,1)'};;;
            case "夜间":
                return {backgroundColor: 'rgba(58,153,208,1)'};;;
            case "扫一扫":
                return {backgroundColor: 'rgba(70,95,176,1)'};;;
            case "邀请好友":
                return {backgroundColor: 'rgba(80,192,70,1)'};;;
            default:
                return {backgroundColor: '#fff'}
        }
    }

    renderItem() {
        let buttons = [];
        let animatedStyle = {
            transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                {scale: this.state.bounceValue},  // 将`bounceValue`赋值给 `scale`
            ]
        };
        let animateTextStyle = {
            transform: [
                {scale: this.state.scaleValue},
            ]
        };;;
        for (let button of this.state.buttonArrays) {
            for (let key in button) {
                let bg = this.getBackGroundColor(key);
                let buttonView = (
                    <View key={key} style={styles.button}>
                        <Animated.Image
                            style={[bg,styles.btnImg,animatedStyle]}
                            source={button[key]}
                        />
                        <Animated.Text style={[styles.btnText,animateTextStyle]}>
                            {key}
                        </Animated.Text>

                    </View>);
                buttons.push(buttonView);
            }
        }
        return buttons;
    }

    render() {
        let weather;
        if (!this.state.weatherData || this.state.weatherData["error"]) {
            weather = (<View style={styles.upperContainer}>
                <Text>
                    出错啦！！！
                </Text>
            </View>);
        } else {
            weather = (<View style={styles.upperContainer}>
                <Text>
                    施工中
                </Text>
            </View>);
        }
        let containerStyle = {
            height: this.state.marginTop ? this.state.marginTop : 52
        };
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.state.onClose() }>
                    <View style={containerStyle}/>
                </TouchableWithoutFeedback>
                <View style={{flex:1, backgroundColor:'rgba(255,255,255,0.8)'}}>
                    <TouchableWithoutFeedback onPress={() => this.state.onClose() }>
                        <View style={styles.mainContainer}>
                            {weather}
                            <View style={styles.downContainer}>
                                {this.renderItem()}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

Weather.propTypes = propTypes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent'
    },

    mainContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    upperContainer: {
        height: 300,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },

    downContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    button: {
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnImg: {
        width: 85,
        height: 85,
        borderRadius: 85 / 2,
    },

    btnText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'FontAwesome',
    }
});
;;