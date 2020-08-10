import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator } from 'react-native'
import { Block, Text, theme, Input, Button } from 'galio-framework'
import { loadWhatsAppContactsList, editSubscriberWhatsApp } from '../../redux/actions/whatsAppSubscribers.actions'
import { materialTheme } from '../../constants/'
import SubscribersListItem from '../../components/WhatsAppSubscribers/SubscribersListItem'
import Modal from 'react-native-modal'

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
      typingTimeout: 0,
      contact: '',
      isShowingModalEdit: false,
      name: '',
      errorMessage: '',
      saveLoading: false
    }
    this.loadSubscribers = this.loadSubscribers.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this._renderSearchResultsFooter = this._renderSearchResultsFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.showEdit = this.showEdit.bind(this)
    this.editSubscriber = this.editSubscriber.bind(this)
    this.changeName = this.changeName.bind(this)
    this.handleEditSubscriber = this.handleEditSubscriber.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadSubscribers()
    })
  }
  componentWillUnmount () {
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
      typingTimeout: setTimeout(function () {
        self.setState({loading: true})
        self.loadSubscribers()
      }, 1000)
    })
  }

  loadSubscribers (currentPage, requestedPage) {
    this.props.loadWhatsAppContactsList({
      current_page: currentPage,
      requested_page: requestedPage,
      last_id: this.props.subscribers && this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none',
      number_of_records: 10,
      first_page: currentPage < requestedPage ? 'next' : currentPage > requestedPage ? 'previous' : 'first'
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
    return (this.props.subscribers && this.props.subscribers.length < this.props.count
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

  showEdit (contact) {
    this.setState({contact: contact, isShowingModalEdit: true, name: contact.name})
  }

  closeEdit () {
    this.setState({isShowingModalEdit: false, name: '', saveLoading: false})
  }

  editSubscriber () {
    if (this.state.name === '') {
      this.setState({errorMessage: 'Subscriber name cannot be empty'})
    } else {
      this.setState({saveLoading: true})
      this.props.editSubscriberWhatsApp(this.state.contact._id, {name: this.state.name}, this.handleEditSubscriber)
    }
  }

  handleEditSubscriber (res) {
    if (res.status === 'success') {
      this.closeEdit()
    }
  }

  changeName (text) {
    this.setState({name: text, errorMessage: ''})
  }

  render () {
    return (
      <Block flex center style={styles.block}>
        <Modal isVisible={this.state.isShowingModalEdit} onBackdropPress={this.closeEdit} style={{margin: 0}}>
          <Block style={{backgroundColor: 'white'}}>
            <Block style={{paddingVertical: 20, marginHorizontal: 10}}>
              <Block style={styles.options}>
                <Text h6>Subscriber Name:</Text>
                <Input
                  color='grey'
                  multiline
                  value={this.state.name}
                  onChangeText={text => this.changeName(text)}
                />
              </Block>
              {this.state.errorMessage !== '' &&
                <Text style={{color: 'red', marginHorizontal: 10}}>{this.state.errorMessage}</Text>
              }
              <Block center style={{marginTop: 15}}>
                <Button radius={10}
                  loading={this.state.saveLoading}
                  style={{marginVertical: 10, marginHorizontal: 16}}
                  onPress={this.editSubscriber}>Save</Button>
              </Block>
            </Block>
          </Block>
        </Modal>
        <Block shadow style={styles.pages} flex>
          {this.state.loading
            ? <Block flex={0.8} middle><ActivityIndicator size='large' /></Block>
            : <FlatList
              data={this.props.subscribers}
              renderItem={({item}) => {
                return <SubscribersListItem
                  item={item}
                  showEdit={this.showEdit}
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
    subscribers: (state.whatsAppSubscribersInfo.contacts),
    count: (state.whatsAppSubscribersInfo.count)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadWhatsAppContactsList,
    editSubscriberWhatsApp
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
