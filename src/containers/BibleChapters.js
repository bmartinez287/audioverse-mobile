import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import MiniPlayer from '../components/MiniPlayer'
import defaultImage from '../../assets/av-logo.png'
import { loadBibleChapters, bibleChapter, resetAndPlayTrack } from '../actions'
import { getBibleChapters, getBibleChaptersPagination, getBible } from '../reducers/selectors'
import { Endpoints } from '../constants'

class BibleChapters extends PureComponent {

  handlePressMetaData() {
    this.props.navigation.navigate({ routeName: 'NowPlaying' })
  }

  handlePressItem(item) {
    this.props.bibleChapter(item.chapter_id)
    this.props.navigation.pop()

    const { items, bible, resetAndPlayTrack } = this.props

    const tracks = items.map(item => ({
      id: bible.version.id + '_' + item.book_id + '_' + item.chapter_id,
      title: item.book_id + ' ' + item.chapter_id,
      artist: bible.version.name,
      artwork: defaultImage,
      url: Endpoints.bibleCDN + bible.version.id + '_' + item.book_id + '_chapter_' + item.chapter_id + '.mp3' + '/' + encodeURIComponent(item.path)
    }))

    const track = tracks.find(el => el.id === bible.version.id + '_' + item.book_id + '_' + item.chapter_id)

    resetAndPlayTrack(tracks, track)
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity onPress={this.handlePressItem.bind(this, item)} style={styles.item}>
        <Text style={styles.chapter}>{item.chapter_id}</Text>
      </TouchableOpacity>
    )
  }
  
  render() {
    
    const { items, pagination, refresh } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={item => item.chapter_id}
          refreshing={pagination.isFetching}
          onRefresh={refresh}
          numColumns={4}
        />
        <MiniPlayer onPressMetaData={this.handlePressMetaData.bind(this)} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  item: {
    width: '25%',
    padding: 15,
    alignItems: 'center'
  },
  chapter: {
    fontSize: 18
  }
})

BibleChapters.propTypes = {
  navigation: PropTypes.object.isRequired,
  items: PropTypes.array,
  pagination: PropTypes.object,
  bible: PropTypes.object,
  refresh: PropTypes.func,
  bibleChapter: PropTypes.func,
  resetAndPlayTrack: PropTypes.func
}

const mapStateToProps = (state) => ({
  items: getBibleChapters(state),
  pagination: getBibleChaptersPagination(state),
  bible: getBible(state)
})

const mapDispatchToProps = (dispatch) => ({
  refresh: (testament, book) => dispatch(loadBibleChapters(false, true, testament, book)),
  bibleChapter: (chapter) => dispatch(bibleChapter(chapter)),
  resetAndPlayTrack: (tracks, track) => dispatch(resetAndPlayTrack(tracks, track))
})

export default connect(mapStateToProps, mapDispatchToProps)(BibleChapters)
