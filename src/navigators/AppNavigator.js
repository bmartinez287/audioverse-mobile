import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, View, TouchableOpacity, Easing, Animated } from 'react-native'
import { connect } from 'react-redux'
import { StackNavigator, TabNavigator, TabBarTop, DrawerNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather'

import I18n from '../../locales'
import { getLanguage } from '../reducers/selectors'
import CustomDrawerContent from '../containers/CustomDrawerContent'
import Login from '../containers/Login'
import Signup from '../containers/Signup'
import NewRecordings from '../containers/NewRecordings'
import TrendingRecordings from '../containers/TrendingRecordings'
import FeaturedRecordings from '../containers/FeaturedRecordings'
import Books from '../containers/Books'
import Book from '../containers/Book'
import Stories from '../containers/Stories'
import Story from '../containers/Story'
import Presenters from '../containers/Presenters'
import Presenter from '../containers/Presenter'
import Conferences from '../containers/Conferences'
import Conference from '../containers/Conference'
import Sponsors from '../containers/Sponsors'
import Sponsor from '../containers/Sponsor'
import Series from '../containers/Series'
import Serie from '../containers/Serie'
import Topics from '../containers/Topics'
import Topic from '../containers/Topic'
import Settings from '../containers/Settings'
import NowPlaying from '../containers/NowPlaying'

const mapStateToProps = (state) => ({
  language: getLanguage(state)
})

const TabBarLabel = connect(mapStateToProps)(
  ({ language, tintColor, title }) => (
    <Text style={{color: tintColor, fontSize: 13, margin: 8, fontWeight: 'bold'}}>{I18n.t(title, {locale: language})}</Text>
  )
)

const HeaderTitle = connect(mapStateToProps)(
  ({ language, title }) => (
    <Text>{I18n.t(title, {locale: language})}</Text>
  )
)

const DrawerLabel = connect(mapStateToProps)(
  ({ language, tintColor, title }) => (
    <Text style={{margin: 16, fontWeight: 'bold', color: tintColor}}>{I18n.t(title, {locale: language})}</Text>
  )
)

const AuthStack = StackNavigator({
  Login: Login,
  Signup: Signup
}, {
  headerMode: 'none'
})

const AppTab = TabNavigator({
  New: {screen: NewRecordings, navigationOptions: {tabBarLabel: ({ tintColor }) => <TabBarLabel tintColor={tintColor} title="new_presentations" />}},
  Trendings: {screen: TrendingRecordings, navigationOptions: {tabBarLabel: ({ tintColor }) => <TabBarLabel tintColor={tintColor} title="trending_presentations" />}},
  Featured: {screen: FeaturedRecordings, navigationOptions: {tabBarLabel: ({ tintColor }) => <TabBarLabel tintColor={tintColor} title="featured_presentations" />}}
}, {
  tabBarOptions: {
    labelStyle: {
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    style: {
      backgroundColor: '#E53935'
    },
    indicatorStyle: {
      backgroundColor: '#FFFFFF'
    }
  },
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  animationEnabled: true,
  swipeEnabled: true,
})


const generateScreen = () => () => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text></Text>
  </View>
)

const screenNavigationOptions = (title, icon) => ({
  title: <HeaderTitle title={title} />,
  drawerLabel: ({ tintColor }) => <DrawerLabel tintColor={tintColor} title={title} />,
  drawerIcon: ({ tintColor }) => <Icon name={icon} size={24} color={tintColor} />
})

const AppDrawer = DrawerNavigator({
  MyLists: {screen: generateScreen(), navigationOptions: screenNavigationOptions('my_lists', 'list')},
  Presentations: {screen: AppTab, navigationOptions: screenNavigationOptions('presentations', 'mic')},
  Bible: {screen: generateScreen(), navigationOptions: screenNavigationOptions('bible', 'plus-square')},
  Books: {screen: Books, navigationOptions: screenNavigationOptions('books', 'book')},
  Stories: {screen: Stories, navigationOptions: screenNavigationOptions('stories', 'radio')},
  Presenters: {screen: Presenters, navigationOptions: screenNavigationOptions('presenters', 'user')},
  Conferences: {screen: Conferences, navigationOptions: screenNavigationOptions('conferences', 'layers')},
  Sponsors: {screen: Sponsors, navigationOptions: screenNavigationOptions('sponsors', 'users')},
  Series: {screen: Series, navigationOptions: screenNavigationOptions('series', 'tag')},
  Topics: {screen: Topics, navigationOptions: screenNavigationOptions('topics', 'target')},
  DownloadQueue: {screen: generateScreen(), navigationOptions: screenNavigationOptions('download_queue', 'download')},
  Settings: {screen: Settings, navigationOptions: screenNavigationOptions('settings', 'sliders')},
  About: {screen: generateScreen(), navigationOptions: screenNavigationOptions('about', 'info')}
}, {
  contentComponent: CustomDrawerContent,
  initialRouteName: 'Presentations'
})

const AppDrawerStack = StackNavigator({
  AppDrawer: AppDrawer
}, {
  headerMode: 'none',
  navigationOptions: ({ navigation }) => ({
    headerStyle: { backgroundColor: '#E53935', elevation: 0 },
    headerTintColor: '#FFFFFF',
    gesturesEnabled: false,
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('DrawerToggle')}><Icon name="menu" size={24} color="#FFFFFF" style={{paddingHorizontal: 15}} /></TouchableOpacity>,
    headerRight: <TouchableOpacity onPress={() => {}}><Icon name="search" size={24} color="#FFFFFF" style={{paddingHorizontal: 15}} /></TouchableOpacity>
  })
})

const AppStack = StackNavigator({
  Auth: AuthStack,
  App: AppDrawerStack,
  Book,
  Story,
  Presenter,
  Conference,
  Sponsor,
  Serie,
  Topic
},{
  initialRouteName: 'App',
  navigationOptions: {
    headerBackTitle: null,
    headerStyle: {backgroundColor: '#E53935', elevation: 0},
    headerTintColor: '#FFFFFF'
  }
})

const AppNavigator = StackNavigator({
  AppStack: AppStack,
  NowPlaying: NowPlaying
},{
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: {
    gesturesEnabled: true
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps
      const { index } = scene

      const height = layout.initHeight
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0],
      })

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      })

      return { opacity, transform: [{ translateY }] }
    },
  })
})

export default AppNavigator
