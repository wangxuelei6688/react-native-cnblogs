import React, { Component, PropTypes } from 'react';
import {
	StyleSheet,
	Image,
	Dimensions
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import _ from 'lodash';

import HtmlRenderStyle from '../style/htmlRender';

const {width, height} = Dimensions.get('window');
const defaultMaxImageWidth = width - 30 - 20;

class HtmlRender extends Component {
	
	constructor(props) {
		super(props);

		this.images = {};
	}

	onLinkPress(url) {
		console.info("onLinkPress, url="+url);
	}

	componentDidMount(){

		console.info(this.images);

		for (var prop in this.images){
			console.info(this.images[prop]);
		}

			/*
			Image.getSize(this.props.source.uri, (width, height) => {
		      this.setState({width, height});
		    });
		    */
	}

	onImageLoadEnd(imageUri, imageId){
		
		console.info("onImageLoadEnd trigger: " + imageUri);

		Image.getSize && Image.getSize(imageUri, (w, h)=> {
			if (w >= defaultMaxImageWidth) {
				h = (defaultMaxImageWidth / w) * h;
				w = defaultMaxImageWidth;
			}
			this.images[imageId] && this.images[imageId].setNativeProps({
				style: {
					width: w,
					height: h
				}
			});
		});
	}

	renderNode(node, index, list) {
		if(node.name && node.name == 'img'){
			const imageUri = node.attribs.src;
			const imageId = _.uniqueId('image_');
			return (
				<Image
					key={ imageId }
					ref={ view=>this.images[imageId] = view }
					style={ contentStyles.img }
					source={{uri:imageUri}}
					onLoadEnd={ this.onImageLoadEnd.bind(this, imageUri, imageId) }
				/>
			)
		}
	}


	render() {
		return (
			<HTMLView
				value={this.props.content}
				stylesheet={ HtmlRenderStyle }
				onLinkPress={this.onLinkPress.bind(this)}
				renderNode={this.renderNode.bind(this)}>
			</HTMLView>
		)
	}
}

const contentStyles = StyleSheet.create({
	img: {
		width: defaultMaxImageWidth,
		height: defaultMaxImageWidth,
		resizeMode: Image.resizeMode.cover
	}
});


export default HtmlRender;