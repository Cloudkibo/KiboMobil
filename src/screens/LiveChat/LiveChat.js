import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator } from 'react-native'
import { Block, Text, theme, Input } from 'galio-framework'
import { fetchSubscribers } from '../../redux/actions/subscribers.actions'
import Icon from '../../components/Icon'
import { materialTheme } from '../../constants/'
import SessionsListItem from '../../components/LiveChat/SessionsListItem'
import Tabs from '../../components/Tabs';

import {
  fetchOpenSessions,
  fetchCloseSessions,
  fetchUserChats,
  fetchTeamAgents,
  changeStatus,
  unSubscribe,
  getCustomers,
  appendSubscriber,
  assignToTeam,
  assignToAgent,
  sendNotifications,
  updatePendingResponse,
  sendChatMessage,
  uploadAttachment,
  sendAttachment,
  uploadRecording,
  searchChat,
  markRead,
  updateLiveChatInfo,
  deletefile,
  clearSearchResult,
  getSMPStatus,
  updateSessionProfilePicture
} from '../../redux/actions/liveChat.actions'
const { width } = Dimensions.get('screen')

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      fetchingChat: false,
      loadingChat: true,
      sessionsLoading: false,
      tabValue: 'open',
      numberOfRecords: 25,
      filterSort: -1,
      filterPage: '',
      filterSearch: '',
      filterPending: false,
      filterUnread: false,
      sessions: [],
      sessionsCount: 0,
      activeSession: {},
      teamAgents: [],
      userChat: [],
      showSearch: false,
      customFieldOptions: [],
      showingCustomFieldPopover: false,
      smpStatus: []
    }
    this.loadMore = this.loadMore.bind(this)
    this._renderSearchResultsFooter = this._renderSearchResultsFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)

    this.fetchSessions(true, 'none', false)
  }

  getChatPreview (message, repliedBy, subscriberName) {
    let chatPreview = ''
    if (message.componentType) {
      // agent
      chatPreview = (!repliedBy || (repliedBy.id === this.props.user._id)) ? `You` : `${repliedBy.name}`
      if (message.componentType === 'text') {
        chatPreview = `${chatPreview}: ${message.text}`
      } else {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      }
    } else {
      // subscriber
      chatPreview = `${subscriberName}`
      if (message.attachments) {
        if (message.attachments[0].type === 'template' &&
          message.attachments[0].payload.template_type === 'generic'
        ) {
          chatPreview = message.attachments[0].payload.elements.length > 1 ? `${chatPreview} sent a gallery` : `${chatPreview} sent a card`
        } else if (message.attachments[0].type === 'template' &&
          message.attachments[0].payload.template_type === 'media'
        ) {
          chatPreview = `${chatPreview} sent a media`
        } else if (['image', 'audio', 'location', 'video', 'file'].includes(message.attachments[0].type)) {
          chatPreview = `${chatPreview} shared ${message.attachments[0].type}`
        } else {
          chatPreview = `${chatPreview}: ${message.text}`
        }
      } else {
        chatPreview = `${chatPreview}: ${message.text}`
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
  }

  changeSearchValue (value) {
    this.setState({searchValue: value, pageSelected: 0}, () => {
      this.loadSubscribers()
    })
  }

  updateLoading () {
    this.setState({loading: false})
  }

  loadMore () {
    this.setState({
      onEndReachedCalledDuringMomentum: false
    })
    let pageSelected = this.state.pageSelected
    if (this.props.subscribers.length < this.props.count) {
      this.setState({pageSelected: pageSelected + 1})
      this.loadSubscribers(pageSelected, pageSelected + 1)
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
    return (
      this.state.loading || (this.props.subscribers && this.props.subscribers.length < this.props.count.length)
        ? <View style={{flex: 1, alignItems: 'center'}}><ActivityIndicator size='large' /></View>
        : null
    )
  }

  _loadMoreData () {
    if (!this.state.onEndReachedCalledDuringMomentum && this.props.subscribers.length < this.props.count) {
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
            data={[{id: 'open', title: 'Open'}, {id: 'closed', title: 'Closed'}]}
            initialIndex={'open'} />
          <Input
            right
            color='black'
            style={styles.search}
            placeholder='Search Subscribers'
            iconContent={<Icon size={25} color={theme.COLORS.MUTED} name='search' family='feather' />}
            onChangeText={text => this.changeSearchValue(text)}
            value={this.state.searchValue}
          />
          <FlatList
            data={this.props.openSessions}
            renderItem={({item}) => {
              return <SessionsListItem
                session={item}
                getChatPreview={this.getChatPreview}
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
        </Block>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    openSessions: (state.liveChat.openSessions),
    openCount: (state.liveChat.openCount),
    closeCount: (state.liveChat.closeCount),
    closeSessions: (state.liveChat.closeSessions),
    userChat: (state.liveChat.userChat),
    chatCount: (state.liveChat.chatCount),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    customers: (state.liveChat.customers),
    // members: (state.membersInfo.members),
    // teams: (state.teamsInfo.teams),
    searchChatMsgs: (state.liveChat.searchChat)
    // socketData: (state.socketInfo.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    unSubscribe,
    fetchOpenSessions,
    fetchCloseSessions,
    // updatePicture,
    fetchTeamAgents,
    assignToTeam,
    changeStatus,
    getCustomers,
    appendSubscriber,
    // loadTeamsList,
    sendNotifications,
    // loadMembersList,
    assignToAgent,
    sendChatMessage,
    uploadAttachment,
    sendAttachment,
    uploadRecording,
    searchChat,
    fetchUserChats,
    markRead,
    // clearSocketData,
    updateLiveChatInfo,
    deletefile,
    clearSearchResult,
    // urlMetaData,
    getSMPStatus,
    updateSessionProfilePicture
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
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
  }
})
