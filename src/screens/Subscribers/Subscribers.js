import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator } from 'react-native'
import { Block, Text, theme, Input } from 'galio-framework'
import { fetchSubscribers } from '../../redux/actions/subscribers.actions'
import Icon from '../../components/Icon'
import { materialTheme } from '../../constants/'
import SubscribersListItem from '../../components/Subscribers/SubscribersListItem'

const { width } = Dimensions.get('screen')

class Subscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      searchValue: '',
      pageSelected: 0,
      onEndReachedCalledDuringMomentum: true,
      lastLoadCount: 0,
      loading: false
    }
    this.loadSubscribers = this.loadSubscribers.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this._renderSearchResultsFooter = this._renderSearchResultsFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
    this.loadSubscribers()
  }

  changeSearchValue (value) {
    this.setState({searchValue: value, pageSelected: 0}, () => {
      this.loadSubscribers()
    })
  }

  loadSubscribers (currentPage, requestedPage) {
    this.setState({loading: true})
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
            data={this.props.subscribers}
            renderItem={({item}) => {
              return <SubscribersListItem item={item} />
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
    subscribers: (state.subscribersInfo.subscribers),
    count: (state.subscribersInfo.count)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSubscribers
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
