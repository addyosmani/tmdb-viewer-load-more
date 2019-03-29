
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import MovieCard from '../containers/MovieCard';
import { getMaxItemsAmountPerRow, getRowsAmount } from './InfiniteMoviesList';

const ITEM_HEIGHT = 360;

function generateIndexesForRow(rowIndex, maxItemsPerRow, itemsAmount) {
  const result = [];
  const startIndex = rowIndex * maxItemsPerRow;

  for (let i = startIndex; i < Math.min(startIndex + maxItemsPerRow, itemsAmount); i++) {
    result.push(i);
  }

  return result;
}

const RowItem = React.memo(function RowItem({movieId, classes}) {
  return (
    <Grid item className={classes.gridItem} key={movieId}>
      <MovieCard id={movieId} classes={{root: classes.card}} />
    </Grid>
  );
});

class MoviesList extends PureComponent {

  constructor(props) {
    super(props);
    this._listWidth = 0.85 * window.innerWidth;
    this._listHeight = window.innerHeight - 132;
    this._listRef = React.createRef();
  }
  
  noItemsRenderer = () => (
    <Grid item>
      <Typography>No movies found</Typography>
    </Grid>
  );

  componentDidMount() {
    const { movies } = this.props;
    if (movies.length === 0) {
      this.props.loadMoreItems();
    }
  }

  async componentDidUpdate(prevProps) {
    const { movies: prevMovies } = prevProps;
    const { movies, hasMore, loadMoreItems, listRows, onAddMovies } = this.props;
    let rowsCount = 0;
    if(hasMore && prevMovies.length === 0 && movies.length === 0) {
      loadMoreItems();
      rowsCount = getRowsAmount(this._listWidth, movies.length);
    }
    rowsCount = getRowsAmount(this._listWidth, movies.length);
    if (listRows !== rowsCount) {
      onAddMovies(rowsCount, this._listRef, listRows);
    }
  }

  render() {
    const { classes, movies, _onItemsRendered } = this.props;

    const rowCount = getRowsAmount(this._listWidth, movies.length);
    const rowRenderer = ({ index, style }) => {
      const { movies, classes } = this.props;

      const maxItemsPerRow = getMaxItemsAmountPerRow(this._listWidth);
      const moviesIds = generateIndexesForRow(index, maxItemsPerRow, movies.length).map(movieIndex => movies[movieIndex]);
      return (
        <div style={style} className={classes.row}>
          { moviesIds.map(movieId => (<RowItem key={movieId} movieId={movieId} classes={classes} />)) }
        </div>
      )
    };

    return (
      <Fragment>
        <List
          ref={this._listRef}
          className={classes.grid}
          height={this._listHeight}
          width={this._listWidth}
          itemCount={rowCount}
          itemSize={ITEM_HEIGHT}
          onItemsRendered={_onItemsRendered}>
          {rowRenderer}
        </List>
      </Fragment>
    );
  }
};

MoviesList.defaultProps = {
  movies: [],
  isFetching: false,
  hasMore: false,
  reset: false,
  fetchMovies: () => {},
};

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.number.isRequired),
  fetchMovies: PropTypes.func,
  hasMore: PropTypes.bool,
  isFetching: PropTypes.bool,
  reset: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default MoviesList;