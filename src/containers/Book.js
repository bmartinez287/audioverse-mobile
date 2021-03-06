import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import List from '../components/List'
import ListItem from '../components/ListItem'
import MiniPlayer from '../components/MiniPlayer'
import { loadBook, resetAndPlayTrack } from '../actions'
import { getBook, getBookPagination } from '../reducers/selectors'

class Book extends PureComponent {

  componentDidMount() {
    this.props.load(this.props.navigation.state.params.url)
  }

  handlePressMetaData() {
    this.props.navigation.navigate({ routeName: 'NowPlaying' })
  }

  renderItem({ item }) {
    return (
      <ListItem
        avatar={{source: item.artwork}}
        title={item.title}
        subtitle={item.artist + ' \u00B7 ' + item.duration}
        onPress={() => this.props.resetAndPlayTrack(this.props.items, item)}
      />
    )
  }
  
  render() {
    const { items, pagination, refresh } = this.props

    return (
      <View style={styles.container}>
        <List renderItem={this.renderItem.bind(this)} items={items} {...pagination} onRefresh={refresh} />
        <MiniPlayer onPressMetaData={this.handlePressMetaData.bind(this)} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  }
})

Book.propTypes = {
  navigation: PropTypes.object.isRequired,
  items: PropTypes.array,
  pagination: PropTypes.object,
  load: PropTypes.func.isRequired,
  refresh: PropTypes.func,
  resetAndPlayTrack: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  items: getBook(state),
  pagination: getBookPagination(state)
})

const mapDispatchToProps = (dispatch) => ({
  load: (url) => dispatch(loadBook(false, false, url)),
  refresh: (url) => dispatch(loadBook(false, true, url)),
  resetAndPlayTrack: (tracks, track) => dispatch(resetAndPlayTrack(tracks, track))
})

export default connect(mapStateToProps, mapDispatchToProps)(Book)
