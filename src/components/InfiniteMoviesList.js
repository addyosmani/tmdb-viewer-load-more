
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MoviesList from './MoviesList';
import LoadMoreButton from './LoadMoreButton';

const ITEM_WIDTH = 400;

const styles = theme => ({
  grid: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    justifyContent: 'center',
  },
  gridItem: {
    width: ITEM_WIDTH,
    padding: 1.5 * theme.spacing.unit,
  },
  card: {
    height: '100%',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  }
});

class InfiniteMoviesList extends PureComponent {

  state = {
    showLoadMore: false,
    listRows: 0
  }
  
  loadMoreItems = async () => {
    if (!this.props.isFetching) {
      try {
        await this.props.fetchMovies();
      } catch(e) {
        console.log(e);
      }
    }
  };

  _onItemsRendered = param => {
    const rowsCount = getRowsAmount(0.85 * window.innerWidth, this.props.movies.length);
    if(param.visibleStopIndex === rowsCount - 1) {
      this.setState({showLoadMore: true});
    } else {
      if(this.state.showLoadMore) {
        this.setState({showLoadMore: false});
      }
    }
  }

  onAddMovies = (listRows, listRef, prevRows) => {
    this.setState({listRows: listRows});
    listRef.current.scrollToItem(prevRows, "center");
  }

  render() {
    const { hasMore } = this.props;
    const { showLoadMore } = this.state;
    const showLoadMoreButton = hasMore && showLoadMore;

    return (
      <Fragment>
        <MoviesList
          {...this.props}
          loadMoreItems={this.loadMoreItems}
          _onItemsRendered={this._onItemsRendered}
          onAddMovies={this.onAddMovies}
          listRows={this.state.listRows}
        />
        <LoadMoreButton
          showLoadMore={showLoadMoreButton}
          loadMoreItems={this.loadMoreItems} />
      </Fragment>
    );
  }
};

InfiniteMoviesList.defaultProps = {
  movies: [],
  isFetching: false,
  hasMore: false,
  reset: false,
  fetchMovies: () => {},
};

InfiniteMoviesList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.number.isRequired),
  fetchMovies: PropTypes.func,
  hasMore: PropTypes.bool,
  isFetching: PropTypes.bool,
  reset: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfiniteMoviesList);

export function getMaxItemsAmountPerRow(width) {
  return Math.max(Math.floor(width / ITEM_WIDTH), 1);
}

export function getRowsAmount(width, itemsAmount, hasMore) {
  const maxItemsPerRow = getMaxItemsAmountPerRow(width);
  return Math.ceil(itemsAmount/ maxItemsPerRow);
}