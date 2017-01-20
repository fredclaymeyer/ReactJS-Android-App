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
  TouchableOpacity
} from 'react-native';

export default class AwesomeProject extends Component {
  constructor() {
    super();
    this.state = {
      userHasStarted: false,
      deciseconds: -10,
      breathDuration: 140,
      breathCount: 3
    };
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({ deciseconds: this.state.deciseconds + 1 });
    // }, 100);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  startAfterButtonPress() {
    this.setState({
      userHasStarted: true
    });

    setTimeout(function() {
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
    }.bind(this),1000);
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
    let opacity = .25 + .5 * this.returnBreathRhythmFraction();
    return {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,' + opacity + ')',
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ this.breathingBackground() }>
          <Button hidden={ this.state.userHasStarted } clickHandler={ this.startAfterButtonPress.bind(this) } />
          <Count hidden={ this.isNotBreathing() } breaths={ this.calculateBreathCount() } />
          <Message hidden={ ! this.isDoneBreathing() } content="Don't you feel better? :)" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#22aa55',
  },
  count: {
    fontSize: 50,
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#eee',
    padding: 10,
  }
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

  render() {
    if( this.props.hidden === true ) {
      return ( <Text /> );
    }
    return (
      <Text style={ styles.message }>
        { this.props.content }
      </Text>
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
          <Text onPress={this.props.clickHandler} >Ready</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
