/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity
} from 'react-native';

const backupForNoFetched = 'Have a good day! :)';
const screenTransitionPauseInDeciseconds = 10;

getFullWidth = () => {
  return Dimensions.get('window').width;
}

getFullHeight = () => {
  return Dimensions.get('window').height;
}

export default class DeepBreaths extends Component {

  constructor() {
    super();
    this.state = {
      userHasStarted: false,
      deciseconds: screenTransitionPauseInDeciseconds * -1,
      breathDuration: 14,
      breathCount: 3,
      requestSource: 'https://wpshout.com/wp-json/threedeepbreaths/v1/happyimages',
      fetchedURL: false,
    };
  }

  componentDidMount() {
    fetch(this.state.requestSource)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.error(responseJson[0]);
        let url = responseJson[0];
        if( typeof(url) !== 'undefined' ) {        
          this.setState({
            fetchedURL: url,
          });
        }
      }).catch((error) => {
        // alert("No internet?");
      });
  }



    // let me = fetch('https://facebook.github.io/react-native/movies.json');

    // me = me.then( 
    //     function() {
    //       // alert("DIE");
    //       return "stfu";
    //      // return "DIE";          
    //     }
    //     // (jsonResponse) => {
    //     //   return "LOLSTFU"
    //     // }
    //   ).catch(
    //     (error) => {
    //       return "ERRR";
    //     }
    //   );

    //   return me;

      // .then( (jsonResponse) => jsonResponse.json() )
      // .then( (parsedJson) => "HELP"
      // ).catch((fetchError) => {
      //   console.error(fetchError);
      // }); 
  // }

  componentWillUnmount() {
    // this.state.serverRequest.abort();
  }

  getArticleTitle = () => {
    'Hi';
  }

  startAfterButtonPress() {
    this.setState({
      userHasStarted: true
    });

    let runTimer = setInterval(function() {
      this.setState({
        deciseconds: this.state.deciseconds + 1
      }, 
      function() {
        if( this.isDoneBreathing() ) {
          clearInterval(runTimer);
        }
      });
    }.bind(this),100);
  }

  getDecisecondsModulus() {
    return this.state.deciseconds % this.state.breathDuration;
  }

  returnBreathRhythmFraction() {

    if( this.isNotBreathing() ) {
      return 0;
    }

    if( this.getDecisecondsModulus() <= ( this.state.breathDuration / 2 ) ) {
      return 2 * this.getDecisecondsModulus() / this.state.breathDuration;
    } else {
      return 2 * ( 1 - this.getDecisecondsModulus() / this.state.breathDuration );
    }
  }

  calculateBreathCount() {
    if( this.state.deciseconds < 0 ) {
      return false;
    }

    return 1 + Math.floor( this.state.deciseconds / this.state.breathDuration );
  }

  isDoneBreathing() {
    return( this.calculateBreathCount() > this.state.breathCount );
  }

  isNotBreathing() {
    return( this.calculateBreathCount() === false || this.isDoneBreathing() );
  }

  controlCounterClassByBreath() {
    var addClass = '';
    if(
      this.state.deciseconds <= 0 ||
      this.getDecisecondsModulus() >= this.state.breathDuration * .75
    ) {
      addClass = ' fading-out';
    }

    return 'counter' + addClass;
  }

  setTransitionDuration( ratioOfBreath ) {
    if (typeof ratioOfBreath === 'undefined') { ratioOfBreath = 1/4; }
    var transitionStyle = {
      transition: 'all ' + this.state.breathDuration / 10 * ratioOfBreath + 's linear'
    };

    return transitionStyle;
  }

  breathingBackground() {
    let size = 100 * this.returnBreathRhythmFraction();
    return {
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: size/2,
      backgroundColor: 'red',
    }
  }

  render() {
    return (
      <View style={ styles.outercontainer }>
        <View style={ this.breathingBackground() } />
        <Button hidden={ this.state.userHasStarted } clickHandler={ this.startAfterButtonPress.bind(this) } />
        <Count hidden={ this.isNotBreathing() } breaths={ this.calculateBreathCount() } />
        <Message hidden={ ! this.isDoneBreathing() } content={ this.state.fetchedURL } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
  },
  container: {
    width: getFullWidth(),
    height: getFullHeight(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 100,
  },
  message: {
    fontSize: 50,
    textAlign: 'center',
    padding: 0,
    margin: 50,
    color: '#ffffff',
  },
  imageholder: {
    width: 100,
    height: 100,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,.5)',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 15,
  },
  buttontext: {
    fontSize: 50,
    fontWeight: '700',
  },
});

class Count extends Component {

  render() {
    if( this.props.hidden === true ) {
      return ( <Text /> );
    } else {
      return (
        <Text style={ styles.count }>
          { this.props.breaths }
        </Text>
      );
    }

  }
}

class Message extends Component {

  constructor() {
    super();
    this.state = {
       fadeValue: new Animated.Value(0),
    }
  }


  imageLayout() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: .7,
    }
  } 

  animLayout() {
    this.state.fadeValue.setValue(0);     // Start small
    Animated.timing(                          // Base: spring, decay, timing
      this.state.fadeValue,                 // Animate `fadeValue`
      {
        toValue: 1,                         // Animate to larger size
        duration: 1000,
      }
    ).start();                                // Start the animation

    return {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: this.state.fadeValue,  // Map `fadeValue` to `opacity`
    }
  }

  render() {
    let imgSrc = this.props.content;

    if( this.props.hidden === true ) {
      return ( <Text /> );
    }

    if( imgSrc === false ) {
      return (
        <Text style={ styles.message }>
          { backupForNoFetched }
        </Text>
      );
    }

    return (
        <View style={ styles.container }>
          <Image style={ this.imageLayout() } source={{uri: imgSrc }} />
          <Animated.View style={ this.animLayout() }>
            <Text style={ styles.message }>
              { backupForNoFetched }
            </Text>
          </Animated.View>
        </View>
    );
  }
}

class Button extends Component {
  render() {
    if( this.props.hidden === true ) {
      return ( <TouchableOpacity /> );
    }
    return (
      <TouchableOpacity style={styles.button} onPress={this.props.clickHandler
      }>
        <View>
          <Text style={styles.buttontext} onPress={this.props.clickHandler} >Ready?</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

AppRegistry.registerComponent('DeepBreaths', () => DeepBreaths);
