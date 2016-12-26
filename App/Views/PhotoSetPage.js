/**
 * Created by jiangzhenhua on 2016/12/26.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    InteractionManager,
    Platform,
    Navigator,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    Modal,
    Animated,
} from "react-native";

const replyImg = require('../Img/contentview_commentbacky@2x.png');
const backArrow = require('../Img/night_icon_back@2x.png');

import {Navibarheight} from "../Model/Constants";

import {getPhotoSetModel,PhotoSetModel} from "../Model/PhotoSetModel"
import {toastShort} from "../Util/ToastUtil";

import LoadingView from "../Component/LoadingView";

const screenWidth = Dimensions.get('window').width;
const imageHeight = screenWidth * 200 / 320;

export default class PhotoSetPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            replyCount:0,
            photoSetData:null
        }
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(()=>{
            getPhotoSetModel(this.props.photoID)
                .then((photoModel)=>{
                    this.setState({
                        photoSetData:photoModel
                    })
                })
                .catch((e)=>{
                    toastShort(e.toString());
                })
        });
    }

    //评论数
    renderReplyNumber() {

        let replyCount = this.state.replyCount;
        let displayCount = '';
        if (!replyCount || replyCount.isNaN) {
            displayCount = '0 回帖';
        } else {
            //拼接显示字符串
            let count = parseInt(replyCount);
            if (count > 10000) {
                displayCount = (count / 10000).toFixed(1) + "万跟帖";
            } else {
                displayCount = count + "跟帖";
            }
        }

        let width = displayCount.length <= 5 ? 50 : 60;

        return (
            <Image
                style={{
                        bottom:0,
                        width:width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        resizeMode: 'stretch',
                        marginRight:8,
                        marginBottom:6
                    }}
                source={replyImg}>
                <Text
                    numberOfLines={1}
                    style={{
                            fontSize: 8,
                            textAlign: 'auto',
                            color:'white',
                            backgroundColor:'transparent'
                        }}
                >
                    {displayCount}
                </Text>
            </Image>
        );
    }

    //返回
    goBack() {
        const { navigator } = this.props;
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到列表了
            navigator.pop();
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
                        source={backArrow}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={()=>{

                    }}
                >
                    {this.renderReplyNumber()}
                </TouchableWithoutFeedback>
            </View>);
    }

    renderBottomBar(){

    }

    renderContent(){
        let views = [];
        for(let photomodel of this.state.photoSetData.photos) {
            let v = (
                <View style={styles.content} key={photomodel.imgurl}>
                    <Image
                        style={{width:screenWidth,height:imageHeight}}
                        resizeMode={'cover'}
                        defaultSource={require('../Img/Detail/photoview_image_default_white@2x.png')}
                        source={{uri:photomodel.imgurl}}
                    />
                </View>);
            views.push(v);
        }
        return views;
    }

    renderPhotoSet(){
        return(
          <ScrollView
              centerContent={true}
              style={styles.base}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
          >
              {this.renderContent()}
          </ScrollView>
        );
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNaivBar()}
                {this.state.photoSetData ?  this.renderPhotoSet() : <LoadingView/>}
            </View>)
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'black'
    },

    base: {
        flex: 1,
        backgroundColor: 'transparent'
    },

    navibar: {
        height: Navibarheight,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    },

    content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
    }

});