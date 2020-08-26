import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Block, Text, theme, Input, Button } from 'galio-framework'
import Icon from '../../components/Icon'
import { materialTheme } from '../../constants/'
import SessionsListItem from '../../components/LiveChat/SessionsListItem'
import Tabs from '../../components/Tabs'
import {getWhatsAppMessageTemplates} from '../../redux/actions/settings.action'
import {fetchOpenSessions, fetchCloseSessions, markRead, updateLiveChatInfo} from '../../redux/actions/whatsAppChat.actions'
import { handleSocketEvent } from './socket'
import * as Notifications from 'expo-notifications'
import { clearSocketDataWhatsapp } from '../../redux/actions/socket.actions'
// import { CommonActions } from '@react-navigation/native'

const { width } = Dimensions.get('screen')

class WhastappLiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      tabValue: 'open',
      numberOfRecords: 25,
      filterSearch: '',
      sessions: [],
      sessionsCount: 0,
      filterSort: -1,
      filterPage: '',
      filterPending: false,
      filterUnread: false,
      activeSession: {},
      typing: false,
      typingTimeout: 0
    }

    this.loadMore = this.loadMore.bind(this)
    this._renderSearchResultsFooter = this._renderSearchResultsFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.openTemplatePage = this.openTemplatePage.bind(this)
    this.getPushNotificationsAsync = this.getPushNotificationsAsync.bind(this)
    // this.fetchSessions(true, 'none', true)
    this.props.getWhatsAppMessageTemplates()
  }

  getPushNotificationsAsync = async (sessionId) => {
    let notifications = await Notifications.getPresentedNotificationsAsync()
    // // let data = JSON.parse(notification[0])
    for (let notification of notifications) {
       if(notification.request.content.data.subscriber._id === sessionId) {
         let removeNotification = await Notifications.dismissNotificationAsync(notification.request.identifier)
       }
    }
    // console.log('notification[0].identifier', notification[0].request.identifier)
    // let removeNotification = await Notifications.dismissNotificationAsync(notification[0].request.identifier)
    // // console.log('notification in Live chat', data)
    // console.log('remove_notidication', removeNotification)

  }

  openTemplatePage () {
    this.props.navigation.navigate('WhatsappTemplateMessage')
  }
  changeActiveSession (session) {
    if (session.unreadCount && session.unreadCount > 0) {
      session.unreadCount = 0
      this.props.markRead(session._id)
      this.getPushNotificationsAsync(session._id)
    }
    this.setState({activeSession: session})
    this.props.navigation.navigate('WhatsappChat', { activeSession: session, sessions: this.state.sessions, tabValue: this.state.tabValue })
    // session.unreadCount = 0
  }

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({loading: true, activeSession: {}})
      this.fetchSessions(true, 'none', true)
    })
    if (this.props.route.params && this.props.route.params.activeSession) {
      this.getPushNotificationsAsync(this.props.route.params.activeSession._id)
      this.props.markRead(this.props.route.params.activeSession._id)
      this.props.navigation.navigate('WhatsappChat', { activeSession: this.props.route.params.activeSession, sessions: this.state.sessions, tabValue: this.state.tabValue })
      this.props.route.params = null
    }
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    if (this.props.route.params && this.props.route.params.activeSession) {
      this.props.markRead(this.props.route.params.activeSession._id)
      this.props.navigation.navigate('WhatsappChat', { activeSession: this.props.route.params.activeSession, sessions: this.state.sessions, tabValue: this.state.tabValue })
      this.props.route.params = null
    }
    let state = {}
    if (nextProps.openSessions || nextProps.closeSessions) {
      state.loading = false
      state.sessionsLoading = false
      let sessions = this.state.tabValue === 'open' ? nextProps.openSessions : nextProps.closeSessions
      sessions = sessions || []
      state.sessions = sessions
      state.sessionsCount = this.state.tabValue === 'open' ? nextProps.openCount : nextProps.closeCount
    }
    this.setState({
      ...state
    })
    if (nextProps.socketData) {
      handleSocketEvent(
        nextProps.socketData,
        this.state,
        this.props,
        this.props.updateLiveChatInfo,
        this.props.user,
        this.props.clearSocketDataWhatsapp
      )
    }
  }

  changeTab (value) {
    this.setState({
      tabValue: value,
      sessions: value === 'open' ? this.props.openSessions : this.props.closeSessions,
      sessionsCount: value === 'open' ? this.props.openCount : this.props.closeCount
    })
  }

  profilePicError (subscriber, e) {
    e.persist()
    e.target.src = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
  }

  getChatPreview (message, repliedBy, subscriberName) {
    let chatPreview = ''
    if (message.format === 'whatsApp') {
      // subscriber
      chatPreview = `${subscriberName}`
      if (message.componentType !== 'text') {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      } else {
        chatPreview = `${chatPreview}: ${message.text}`
      }
    } else {
      // agent
      chatPreview = (!repliedBy || (repliedBy.id === this.props.user._id)) ? `You` : `${repliedBy.name}`
      if (message.componentType === 'text') {
        chatPreview = `${chatPreview}: ${message.text}`
      } else {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      }
    }
    return chatPreview
  }

  fetchSessions (firstPage, lastId, fetchBoth) {
    const data = {
      first_page: firstPage,
      last_id: lastId,
      number_of_records: this.state.numberOfRecords,
      filter: false,
      filter_criteria: {
        sort_value: this.state.filterSort,
        page_value: this.state.filterPage,
        search_value: this.state.filterSearch,
        pendingResponse: this.state.filterPending,
        unreadMessages: this.state.filterUnread
      }
    }
    if (fetchBoth) {
      this.props.fetchOpenSessions(data)
      this.props.fetchCloseSessions(data)
    } else if (this.state.tabValue === 'open') {
      this.props.fetchOpenSessions(data)
    } else if (this.state.tabValue === 'close') {
      this.props.fetchCloseSessions(data)
    }
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  // console.log('props.route.params.activeSession',this.props.route.params.activeSession)
    // this.props.navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [
    //       { name: 'Chat',  params: { activeSession: this.props.route.params.activeSession } }        ],
    //   })
    // )
  }

  handleSearch (value) {
    const self = this

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout)
    }
    self.setState({
      filterSearch: value,
      typing: false,
      typingTimeout: setTimeout(function () {
        self.setState({loading: true})
        self.fetchSessions(true, 'none', true)
      }, 1000)
    })
  }

  updateLoading () {
    this.setState({loading: false})
  }

  loadMore () {
    this.setState({
      onEndReachedCalledDuringMomentum: false
    })
    if (this.state.sessions.length < this.state.sessionsCount) {
      const lastId = this.state.sessions[this.state.sessions.length - 1].last_activity_time
      this.fetchSessions(false, lastId)
    }
  }

  renderEmpty () {
    return (
      !this.state.loading
        ? <Text color={materialTheme.COLORS.ERROR} style={styles.empty}>No data to display</Text>
        : null
    )
  }

  _onMomentumScrollBegin () {
    this.setState({ onEndReachedCalledDuringMomentum: false })
  }

  _renderSearchResultsFooter () {
    return (this.state.sessions && this.state.sessions.length < this.state.sessionsCount
      ? <View style={{flex: 1, alignItems: 'center'}}><ActivityIndicator size='large' /></View>
      : null
    )
  }

  _loadMoreData () {
    if (!this.state.onEndReachedCalledDuringMomentum && this.state.sessions.length < this.state.sessionsCount) {
      this.setState({ onEndReachedCalledDuringMomentum: true }, () => {
        setTimeout(() => {
          this.loadMore()
        }, 1500)
      })
    }
  }

  render () {
    return (
      <Block flex center style={styles.block}>
        <Block shadow style={styles.pages} flex>
          <Tabs
            data={[{id: 'open', title: 'Open'}, {id: 'close', title: 'Closed'}]}
            initialIndex={'open'}
            onChange={id => this.changeTab(id)} />
          <Input
            right
            color='black'
            style={styles.search}
            placeholder='Search Subscribers'
            iconContent={<Icon size={25} color={theme.COLORS.MUTED} name='search' family='feather' />}
            value={this.state.filterSearch}
            onChangeText={text => this.handleSearch(text)}
            id='generalSearch'
          />
          {this.state.loading
            ? <Block flex={0.8} middle><ActivityIndicator size='large' /></Block>
            : <FlatList
              data={this.state.sessions}
              renderItem={({item}) => {
                return <SessionsListItem
                  session={item}
                  getChatPreview={this.getChatPreview}
                  profilePicError={this.profilePicError}
                  changeActiveSession={this.changeActiveSession}
                />
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={this.renderEmpty()}
              bounces={false}
              onEndReached={() => this._loadMoreData()}
              onEndReachedThreshold={0.01}
              ListFooterComponent={this._renderSearchResultsFooter}
              onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
            />
          }
          <Button
            style={styles.myButton}
            onPress={this.openTemplatePage}><MaterialIcons name='message' size={30} color='white' /></Button>
        </Block>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    openSessions: (state.whatsAppChatInfo.openSessions),
    openCount: (state.whatsAppChatInfo.openCount),
    closeCount: (state.whatsAppChatInfo.closeCount),
    closeSessions: (state.whatsAppChatInfo.closeSessions),
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options),
    socketData: (state.socketInfo.socketDataWhatsapp),
    userChat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchOpenSessions,
    fetchCloseSessions,
    getWhatsAppMessageTemplates,
    markRead,
    clearSocketDataWhatsapp,
    updateLiveChatInfo
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhastappLiveChat)
const styles = StyleSheet.create({
  block: {
    width: width
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 15
  },
  pages: {
    width: width,
    borderWidth: 0,
    marginHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 0.1
  },
  empty: {
    marginHorizontal: 16,
    marginVertical: 20
  },
  myButton: {
    padding: 5,
    height: 50,
    width: 50,
    borderRadius: 120,
    backgroundColor: '#716aca',
    alignItems: 'center',
    margin: 20,
    position: 'absolute',
    bottom: 0,
    right: 0
  }
})
