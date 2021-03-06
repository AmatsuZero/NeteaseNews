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
import Reply from "./Reply"
import {getCommentsList} from "../Model/ReplyModel"

import LoadingView from "../Component/LoadingView";

const screenWidth = Dimensions.get('window').width;
const imageHeight = screenWidth * 200 / 320;

let hotRelies;

export default class PhotoSetPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            boardid:null,
            replyCount:0,
            photoSetData:null,
            title:'',
            content:'',
            index:1,
        }
        this.changeContent = this.changeContent.bind(this);
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(()=>{

            this.setState({
                boardid:this.props.boardid,
                replyCount:this.props.replyCount
            })

            getPhotoSetModel(this.props.photoID)
                .then((photoModel)=>{
                    let arr = photoModel.photos;
                    this.setState({
                        photoSetData:photoModel,
                        title:arr[0].imgtitle,
                        content:arr[0].note.length > 0 ? arr[0].note : arr[0].imgtitle,
                        index:1
                    })
                })
                .catch((e)=>{
                    toastShort(e.toString());
                })

            getCommentsList(this.state.boardid,this.props.photoID).then((responseData)=>{
                let hp = responseData["hotPosts"];//取出热门评论
                let result = [];
                if (hp && hp.length > 0) {
                    for (let comment of hp) {
                        let model = comment["1"];
                        let hot = createHotReplyModel(model);
                        result.push(hot);
                    }
                }
                return result;
            }).then((comments)=>{
                hotRelies = comments;
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

    _onCommentPress(){
        const { navigator } = this.props;
        navigator.push({
            name: '评论',
            component: Reply,
            params:{
                boardid: this.state.boardid,
                postid: this.props.photoID,
                hotRelies: hotRelies
            }
        })
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
                    onPress={()=>this._onCommentPress()}
                >
                    {this.renderReplyNumber()}
                </TouchableWithoutFeedback>
            </View>);
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
              onScroll={this.changeContent}
              scrollEventThrottle={16}
          >
              {this.renderContent()}
          </ScrollView>
        );
    }

    changeContent(event) {
        let contentOffSetX = event.nativeEvent.contentOffset.x;
        let index = Math.round(contentOffSetX/screenWidth);
        if (index < 0) {
            index = 0;
        }
        let arr = this.state.photoSetData.photos;
        this.setState({
            title:arr[index].imgtitle,
            content:arr[index].note.length > 0 ? arr[index].note : arr[index].imgtitle,
            index:index+1
        })
    }


    renderBottom() {
       return (
           <View style={styles.bottomView}>
               <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                   <Text tyle={{fontSize:19,color:'white'}}>
                       {this.state.title}
                   </Text>
                   <Text style={{fontSize:17,color:'white'}}>
                       {this.state.index + '/' + this.state.photoSetData.photos.length}
                   </Text>
               </View>
               <Text style={{fontSize:14,color:'white'}}>
                   {this.state.content}
               </Text>
           </View>
       );
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNaivBar()}
                {this.state.photoSetData ?  this.renderPhotoSet() : <LoadingView/>}
                {this.state.photoSetData ?  this.renderBottom() : <View/>}
            </View>)
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'black',
        justifyContent:'center'
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
    },

    bottomView: {
        flexDirection:'column',
        flex:1,
        backgroundColor:'transparent',
        justifyContent:'center',
        flexGrow:0.5
    }

});