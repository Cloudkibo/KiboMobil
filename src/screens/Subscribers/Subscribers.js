import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator } from 'react-native'
import { Block, Text, theme, Input } from 'galio-framework'
import { fetchSubscribers, updatePicture, updateSubscribersInfo } from '../../redux/actions/subscribers.actions'
import Icon from '../../components/Icon'
import { materialTheme } from '../../constants/'
import SubscribersListItem from '../../components/Subscribers/SubscribersListItem'
import { handleSocketEvent } from './socket'
import { clearSocketDataSubscribers } from '../../redux/actions/socket.actions'
import { updateDashboardInfo } from '../../redux/actions/dashboard.actions'

const { width } = Dimensions.get('screen')

class Subscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      searchValue: '',
      pageSelected: 0,
      onEndReachedCalledDuringMomentum: true,
      lastLoadCount: 0,
      loading: true,
      typing: false,
      typingTimeout: 0
    }
    this.loadSubscribers = this.loadSubscribers.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this._renderSearchResultsFooter = this._renderSearchResultsFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    if (nextProps.socketData) {
      handleSocketEvent(
        nextProps.socketData,
        this.state,
        this.props,
        this.props.updateSubscribersInfo,
        this.props.updateDashboardInfo,
        this.props.clearSocketDataSubscribers
      )
    }
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  componentDidMount () {
    this.loadSubscribers()
    // this._unsubscribe = this.props.navigation.addListener('focus', () => {
    // })
    this._unsubscribe = this.props.navigation.addListener('blur', (payload) => {
      this.setState({searchValue: ''})
    })
  }
  componentWillUnmount () {
    console.log('componentWillUnmount')
    this._unsubscribe()
  }

  changeSearchValue (value) {
    const self = this

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout)
    }
    self.setState({
      searchValue: value,
      pageSelected: 0,
      typing: false,
      loading: value !== '',
      typingTimeout: setTimeout(function () {
        if (value !== '') {
          self.loadSubscribers()
        }
      }, 1000)
    })
  }

  loadSubscribers (currentPage, requestedPage) {
    this.props.fetchSubscribers({
      current_page: currentPage,
      requested_page: requestedPage,
      last_id: this.props.subscribers && this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none',
      number_of_records: 10,
      first_page: currentPage < requestedPage ? 'next' : currentPage > requestedPage ? 'previous' : 'first',
      filter: true,
      filter_criteria: {
        search_value: this.state.searchValue,
        gender_value: '',
        page_value: '',
        locale_value: '',
        tag_value: '',
        status_value: '',
        source_value: ''
      }
    }, this.updateLoading)
  }

  updateLoading () {
    this.setState({loading: false})
  }

  loadMore () {
    this.setState({
      onEndReachedCalledDuringMomentum: false
    })
    let pageSelected = this.state.pageSelected
    if (this.state.searchValue === '') {
      if (this.props.subscribers.length < this.props.count) {
        this.setState({pageSelected: pageSelected + 1})
        this.loadSubscribers(pageSelected, pageSelected + 1)
      }
    } else {
      if (this.props.searchedSubscribers.length < this.props.searchedCount) {
        this.setState({pageSelected: pageSelected + 1})
        this.loadSubscribers(pageSelected, pageSelected + 1)
      }
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
    if (this.state.searchValue === '') {
      return (this.props.subscribers && this.props.subscribers.length < this.props.count
        ? <View style={{flex: 1, alignItems: 'center'}}><ActivityIndicator size='large' /></View>
        : null
      )
    } else {
      return (this.props.searchedSubscribers && this.props.searchedSubscribers.length < this.props.searchedCount
        ? <View style={{flex: 1, alignItems: 'center'}}><ActivityIndicator size='large' /></View>
        : null
      )
    }
  }

  _loadMoreData () {
    if (this.state.searchValue === '') {
      if (!this.state.onEndReachedCalledDuringMomentum && this.props.subscribers.length < this.props.count) {
        this.setState({ onEndReachedCalledDuringMomentum: true }, () => {
          setTimeout(() => {
            this.loadMore()
          }, 1500)
        })
      }
    } else {
      if (!this.state.onEndReachedCalledDuringMomentum && this.props.searchedSubscribers.length < this.props.searchedCount) {
        this.setState({ onEndReachedCalledDuringMomentum: true }, () => {
          setTimeout(() => {
            this.loadMore()
          }, 1500)
        })
      }
    }
  }

  render () {
    return (
      <Block flex center style={styles.block}>
        <Block shadow style={styles.pages} flex>
          <Input
            right
            color='black'
            style={styles.search}
            placeholder='Search Subscribers'
            iconContent={<Icon size={25} color={theme.COLORS.MUTED} name='search' family='feather' />}
            onChangeText={text => this.changeSearchValue(text)}
            value={this.state.searchValue}
          />
          {this.state.loading
            ? <Block flex={0.8} middle><ActivityIndicator size='large' /></Block>
            : <FlatList
              data={this.state.searchValue === '' ? this.props.subscribers : this.props.searchedSubscribers}
              renderItem={({item}) => {
                return <SubscribersListItem
                  item={item}
                  updatePicture={this.props.updatePicture}
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
        </Block>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    subscribers: (state.subscribersInfo.subscribers),
    count: (state.subscribersInfo.count),
    searchedSubscribers: (state.subscribersInfo.searchedSubscribers),
    searchedCount: (state.subscribersInfo.searchedCount),
    socketData: (state.socketInfo.socketDataSubscribers),
    dashboard: (state.dashboardInfo.dashboard)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSubscribers,
    updatePicture,
    clearSocketDataSubscribers,
    updateSubscribersInfo,
    updateDashboardInfo
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscribers)
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
