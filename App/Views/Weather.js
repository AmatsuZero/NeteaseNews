/**
 * Created by jiangzhenhua on 2016/12/21.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    InteractionManager,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
    Easing,
    Navigator
} from "react-native";
import Loading from "../Component/LoadingView";
import WeatherDetail from "./WeatherDetail";

const propTypes = {
    marginTop: React.PropTypes.number,
    onClose: React.PropTypes.func,
    weatherData: React.PropTypes.object
};

export default class Weather extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            marginTop: 0,
            onClose: () => {
            },
            weatherData: null,
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
                    toValue: 1,
                    easing: Easing.linear
                }
            )
        ]).start(); // 开始执行动画
    }

    getBackGroundColor(key) {
        switch (key) {
            case "搜索":
                return {backgroundColor: 'orange'};
            case "上头条":
                return {backgroundColor: 'red'};
            case "离线":
                return {backgroundColor: 'rgba(213,22,71,1)'};
            case "夜间":
                return {backgroundColor: 'rgba(58,153,208,1)'};
            case "扫一扫":
                return {backgroundColor: 'rgba(70,95,176,1)'};
            case "邀请好友":
                return {backgroundColor: 'rgba(80,192,70,1)'};
            default:
                return {backgroundColor: '#fff'}
        }
    }

    getClimateImg(key) {
        switch (key) {
            case "雷阵雨":
                return require('../Img/Weather/thunder_mini@2x.png');
            case "晴":
                return require('../Img/Weather/sun_mini@2x.png');
            case "多云":
                return require('../Img/Weather/sun_and_cloud_mini@2x.png');
            case "阴":
                return require('../Img/Weather/nosun_mini.png');
            case "雨":
                return require('../Img/Weather/rain_mini@2x.png');
            case "雪":
                return require('../Img/Weather/snowheavy@2x.png');
            default:
                return require('../Img/Weather/sand_float_mini@2x.png')

        }
    }

    getPM(pm) {
        if (pm < 50) {
            return "优";
        } else if (pm < 100) {
            return "良";
        } else {
            return "差";
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
        };
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

    renderWeatherDisplay() {
        let today = '';
        let city = '';
        let temp;
        let weatherModel = this.state.weatherData;
        for (let key in this.state.weatherData) {
            if (weatherModel[key] instanceof Array) {//判断是否是数组类型
                city = key.split('|')[0];
                today = weatherModel[key][0];
            }
        }

        temp = today['temperature'].split('C').join('');

        let display = (

            <TouchableOpacity onPress={()=>{
                this._onPress(weatherModel)
            }}>
                <View style={styles.upperContainer}>
                    <View style={styles.displayLeft}>
                        <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        marginBottom:-20,
                        alignItems:'center'
                    }}>
                            <Text style={{
                            fontSize:101,
                            fontFamily:'Avenir Next',
                            color:'#DE2537'
                        }}>
                                {weatherModel.rt_temperature}
                            </Text>
                            <View style={{
                            flexDirection:'column',
                            marginLeft:30,
                            justifyContent:'flex-start',
                        }}>
                                <Text style={{
                                fontSize:25,
                                fontFamily:'Avenir Next',
                                color:'#DE2537'
                            }}>
                                    ℃
                                </Text>
                                <Text style={{
                                fontSize:17,
                                fontFamily:'Avenir Next',
                                color:'#555555',
                                marginTop:15
                            }}>
                                    {temp}
                                </Text>
                            </View>
                        </View>
                        <View style={{marginLeft:10, marginTop:0}}>
                            <Text style={{
                        fontSize:17,
                        fontFamily:'Avenir Next',
                        color:'black',
                    }}>
                                {weatherModel.dt + ' ' + today.week}
                            </Text>
                            <Text style={{
                        fontSize:17,
                        fontFamily:'Avenir Next',
                        color:'black',
                    }}>
                                {"PM2.5 " + weatherModel.pm2d5['pm2_5'] + ' ' + this.getPM(parseInt(weatherModel.pm2d5['pm2_5']))}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.displayRight}>
                        <Image
                            source={this.getClimateImg(today.climate)}
                        />
                        <Text style={{
                        fontSize:16,
                        fontFamily:'Pingfang SC',
                        color:'black'
                    }}>
                            {today.climate + " " + today.wind}
                        </Text>
                        <Text style={{
                        fontSize:16,
                        fontFamily:'Pingfang SC',
                        color:'black'
                    }}>
                            {city}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>);
        return display;
    }

    _onPress(detail) {
        if (detail) {
            const {navigator} = this.props;
            //这里传递了navigator作为props
            if (navigator) {
                navigator.push({
                    name: '天气详情页面',
                    component: WeatherDetail,
                    params: {
                        weatherData: detail
                    }
                })
            }
        }
    }

    render() {
        let weather;
        if (!this.state.weatherData) {
            weather = (
                <View style={styles.upperContainer}>
                    <Loading/>
                </View>);
        } else if (this.state.weatherData["error"]) {
            weather = (
                <View style={styles.upperContainer}>
                    <Text>
                        出错啦！！！！
                    </Text>
                </View>);
        } else {
            weather = this.renderWeatherDisplay();
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
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center'
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
        fontFamily: 'Pingfang SC',
    },

    displayLeft: {
        marginLeft: 18,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    displayRight: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginRight: 18
    }
});