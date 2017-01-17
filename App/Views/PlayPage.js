/**
 * Created by jiangzhenhua on 2017/1/9.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView,
    Image,
    RecyclerViewBackedScrollView,
    RefreshControl,
    Navigator,
    ScrollView,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Modal,
    Animated,
    InteractionManager,
    Dimensions,
    Platform
} from "react-native";

import VideoRoom from './VideoRoom'
import {Navibarheight} from "../Model/Constants";
const screenWidth = Dimensions.get('window').width;

export default class PlayPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playURL:"http://flv2.bn.netease.com/tvmrepo/2017/1/9/1/EC9RODL91/SD/EC9RODL91-mobile.mp4"
        }
    }

    //返回
    goBack() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
            VideoRoom.onDismiss();
        }
    }

    renderNaivBar() {
        return (
            <View style={styles.navibar}>
                <TouchableWithoutFeedback
                    onPress={()=>{
                        this.goBack();
                    }}
                >
                    <Image
                        style={{
                            bottom:0,
                            marginLeft:8,
                            marginBottom:6
                        }}
                        source={require('../Img/night_icon_back@2x.png')}
                    />
                </TouchableWithoutFeedback>
            </View>);
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNaivBar()}
                <VideoRoom playURL={this.state.playURL} style={styles.playerBlock}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'column'
    },

    playerBlock:{
        width:screenWidth,
        height:200,
        marginLeft:2
    },

    navibar: {
        height: Navibarheight,
        width:screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        backgroundColor:'red'
    },
});