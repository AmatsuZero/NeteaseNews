/**
 * Created by jiangzhenhua on 2016/12/22.
 */
import React from "react";
import {StyleSheet, Text, View, Image, InteractionManager, TouchableOpacity, Dimensions} from "react-native";
import {Navibarheight} from "../Model/Constants";
import Loading from "../Component/LoadingView";

const backArrow = require('../Img/Weather/weather_back@2x.png');
const shareBtn = require('../Img/Weather/weather_share@2x.png');
const locationBtn = require('../Img/Weather/weather_location@2x.png');

const sreenWidth = Dimensions.get('window').width;
const fontStyle = {fontFamily: 'PingFang SC', color: 'white'};

export default class WeatherDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: null,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                weatherData: this.props.weatherData,
            });
        });
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    getClimateImg(key) {
        switch (key) {
            case "雷阵雨":
                return require('../Img/Weather/thunder@2x.png');
            case "晴":
                return require('../Img/Weather/sun@2x.png');
            case "多云":
                return require('../Img/Weather/sunandcloud@2x.png');
            case "阴":
                return require('../Img/Weather/cloud@2x.png');
            case "雨":
                return require('../Img/Weather/rain@2x.png');
            case "雪":
                return require('../Img/Weather/snow@2x.png');
            default:
                return require('../Img/Weather/sandfloat@2x.png');
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

    renderNaivBar(city, date) {

        let fontStyle = {
            fontFamily: 'PingFang SC',
            color: 'white'
        };

        return (
            <View style={styles.navibar}>
                <TouchableOpacity
                    onPress={()=>{
                        this.goBack();
                    }}
                >
                    <Image
                        source={backArrow}
                    />
                </TouchableOpacity>
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <View
                        style={{flexDirection:'row', marginTop:20, justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={[fontStyle, {fontSize:20}]}>
                            {city}
                        </Text>
                        <Image
                            style={{marginLeft:8}}
                            source={locationBtn}
                        />
                    </View>
                    <Text style={[fontStyle, {fontSize:16, marginTop:8}]}>
                        {date}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={()=>{

                    }}
                >
                    <Image
                        source={shareBtn}
                    />
                </TouchableOpacity>
            </View>);
    }

    renderWeatherPanel(climate, temp, pm, wind) {

        return (
            <View style={styles.upperContainer}>
                <Image
                    style={{width:100, height:150}}
                    source={this.getClimateImg(climate)}
                />
                <View style={{
                    flexDirection:'column',
                    justifyContent:'flex-start',
                    marginLeft:8
                }}>
                    <Text style={[fontStyle, {fontSize:34}]}>
                        {temp}
                    </Text>
                    <Text style={[fontStyle, {fontSize:15}]}>
                        {climate}
                    </Text>
                    <Text style={[fontStyle, {fontSize:15}]}>
                        {wind}
                    </Text>
                    <Text style={[fontStyle, {fontSize:15}]}>
                        {"PM2.5 " + pm + ' ' + this.getPM(parseInt(pm))}
                    </Text>
                </View>
            </View>
        );
    }

    renderBottomView(weatherArr) {
        let bottomViews = [];
        for (let i = 1; i < 4; i++) {
            let weatherModel = weatherArr[i];
            let view = (
                <View key={weatherModel.nongli} style={styles.itemStyle}>
                    <Text style={[fontStyle,{fontSize:17, marginTop:-10}]}>
                        {weatherModel.week}
                    </Text>
                    <Image
                        style={{width:50,height:75}}
                        source={this.getClimateImg(weatherModel.climate)}
                    />
                    <Text style={[fontStyle,{fontSize:20, marginTop:-10}]}>
                        {weatherModel.temperature}
                    </Text>
                    <Text style={[fontStyle,{fontSize:14}]}>
                        {weatherModel.climate}
                    </Text>
                    <Text style={[fontStyle,{fontSize:14}]}>
                        {weatherModel.wind}
                    </Text>
                </View>);
            bottomViews.push(view);
        }

        return (
            <View style={styles.bottomView}>
                <View
                    style={{flex:1, flexDirection:'row', justifyContent:'space-around', alignItems:'center', alignSelf:'center'}}>
                    {bottomViews}
                </View>
                <View style={{marginBottom:20, alignSelf:'center'}}>
                    <Text style={{fontSize:11, fontFamily:'PingFang SC', color:'#878787'}}>
                        — 数据来自中国天气 —
                    </Text>
                </View>
            </View>
        );
    }

    render() {

        if (!this.state.weatherData) {
            return (<Loading/>)
        }

        let today;
        let city = '';
        let weatherArr = [];
        let temp;
        let weatherModel = this.state.weatherData;

        for (let key in this.state.weatherData) {
            if (weatherModel[key] instanceof Array) {//判断是否是数组类型
                city = key.split('|')[0];
                today = weatherModel[key][0];
                weatherArr = weatherModel[key];
            }
        }

        temp = today['temperature'].split('C').join('');

        return (
            <Image style={styles.container} source={{uri:weatherModel.pm2d5['nbg2']}}>
                {this.renderNaivBar(city, weatherModel.dt + ' ' + today.week)}
                {this.renderWeatherPanel(today.climate, temp, weatherModel.pm2d5['pm2_5'], today.wind)}
                {this.renderBottomView(weatherArr)}
            </Image>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    upperContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: -20
    },

    bottomView: {
        width: sreenWidth,
        height: 250,
        backgroundColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    navibar: {
        height: Navibarheight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 20
    },

    itemStyle: {
        width: sreenWidth / 3,
        height: 200,
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 45,
        marginVertical: 4
    }
});
;;;