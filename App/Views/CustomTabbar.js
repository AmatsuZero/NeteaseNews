/**
 * Created by jiangzhenhua on 2016/12/19.
 */
import React, {PropTypes} from "react";
import {Image, View, Text, TouchableOpacity, StyleSheet} from "react-native";

const propTypes = {
    goToPage: React.PropTypes.func, // 跳转到对应tab的方法
    activeTab: React.PropTypes.number, // 当前被选中的tab下标
    tabs: React.PropTypes.array, // 所有tabs集合
    tabNames: React.PropTypes.array, // 保存Tab名称
    tabIconNames: React.PropTypes.array, // 保存Tab图标
};

export class CustomTabbar extends React.Component {

    constructor(props) {
        super(props);
    }

    //设置是否有动画
    setAnimationValue({value}) {

    }

    //TabbarItem
    renderTabOption(tab, i) {
        const color = this.props.activeTab == i ? "red" : "#ADADAD"; // 判断i是否是当前选中的tab，设置不同的颜色
        const image = this.props.activeTab == i ? this.props.tabIconNames[i][1] : this.props.tabIconNames[i][0];//根据不同状态，加载不同的图片
        return (
            <TouchableOpacity key={tab} onPress={()=>this.props.goToPage(i)} style={styles.tab}>
                <View style={styles.tabItem}>
                    <Image
                        source={image}// 图标
                    />
                    <Text style={{marginTop:8, color: color, fontSize: 12}}>
                        {this.props.tabNames[i]}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.tabs}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }
}

CustomTabbar.propTypes = propTypes;

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 50,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});