/**
 * Created by jiangzhenhua on 2017/1/6.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    PixelRatio
} from 'react-native';

const defaultStyle = {
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#eeeeee',
    borderWidth:1,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#aaaaaa',
    marginRight:20,
    marginLeft:20,
    alignSelf: 'center',
};

export default class Button extends Component {
    render() {
        return(
            <TouchableHighlight
                style={this.props.style?[this.props.style,defaultStyle]:defaultStyle}
                underlayColor="#B5B5B5"
                onPress={() => {
                    this.props.onPress();
                }}>
                <Text style={{
                    fontSize:14
                }}>{this.props.text}</Text>
            </TouchableHighlight>
        )
    }
}