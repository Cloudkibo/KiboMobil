import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchConnectedPages } from '../../redux/actions/pages.actions'
import { StyleSheet, Dimensions, FlatList, Clipboard, ActivityIndicator } from 'react-native'
import { Button, Block, Text, theme, Input } from 'galio-framework'
import Toast from 'react-native-simple-toast'
import { Select } from '../../components/'

const { width } = Dimensions.get('screen')

class InviteSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pagesFetched: false,
      listData: [{id: '0'}],
      selectedPage: '',
      showToast: false
    }
    this.renderList = this.renderList.bind(this)
    this.getPageOptions = this.getPageOptions.bind(this)
    this.handlePageSelect = this.handlePageSelect.bind(this)
    this.getMessengerLink = this.getMessengerLink.bind(this)
    this.writeToClipboard = this.writeToClipboard.bind(this)
    this.handleFetchPagesResponse = this.handleFetchPagesResponse.bind(this)
  }

  handleFetchPagesResponse (connectedPages) {
    this.setState({pagesFetched: true, selectedPage: connectedPages[0]})
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
    this.props.fetchConnectedPages(this.handleFetchPagesResponse)
  }

  handlePageSelect (index, value) {
    console.log('index', index)
    console.log('value', value)
    let selectedPage = this.props.connectedPages[index]
    this.setState({selectedPage: selectedPage})
  }

  getPageOptions () {
    return this.props.connectedPages.map(page => page.pageName)
  }

  getMessengerLink () {
    return this.state.selectedPage.pageUserName
      ? `https://m.me/${this.state.selectedPage.pageUserName}`
      : `https://m.me/${this.state.selectedPage.pageId}`
  }

  async writeToClipboard () {
    await Clipboard.setString(this.getMessengerLink())
    this.setState({showToast: true})
    Toast.show('Link Copied Successfully!', Toast.SHORT, [
      'UIAlertController'
    ])
  }

  renderList () {
    return (
      <Block style={{paddingVertical: 20}}>
        <Block flex row style={styles.options}>
          <Block flex={0.3} middle><Text size={16}> Select Page:</Text></Block>
          <Block flex={0.7} middle>
            <Select
              style={{width: width * 0.5}}
              value={this.state.selectedPage.pageName}
              options={this.getPageOptions()}
              onSelect={(index, value) => this.handlePageSelect(index, value)}
            />
          </Block>
        </Block>
      </Block>
    )
  }

  render () {
    if (!this.state.pagesFetched ||
      (this.state.pagesFetched && this.props.pages && this.props.pages.length > 0 && this.state.pageSelected === '')) {
      return <ActivityIndicator size='large' style={{flex: 0.8}} />
    } else if (this.props.pages && this.props.pages.length === 0) {
      return <Text>You do not have any connected Pages</Text>
    } else {
      return (
        <Block flex center style={styles.block}>
          <Block style={styles.subBlock}>
            <FlatList
              data={this.state.listData}
              renderItem={this.renderList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
            <Block style={{marginHorizontal: 16}}>
              <Text h6>This is the link to your Facebook Page on Messenger. Copy this link and share it with people to invite them to become subscribers of your page.</Text>
              <Input
                color='black'
                style={{marginTop: 10}}
                editable={false}
                value={this.getMessengerLink()}
              />
            </Block>
            <Block middle style={{marginVertical: 30}}>
              <Button size='small' onPress={this.writeToClipboard}>Copy To Clipboard</Button>
            </Block>
          </Block>
        </Block>
      )
    }
  }
}

function mapStateToProps (state) {
  return {
    connectedPages: (state.pagesInfo.connectedPages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchConnectedPages
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteSubscribers)

const styles = StyleSheet.create({
  block: {
    width: width
  },
  subBlock: {
    width: width,
    borderWidth: 0,
    // marginVertical: theme.SIZES.BASE * 1.5,
    marginHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 0.1
  },
  options: {
    padding: theme.SIZES.BASE / 2
  }
})
