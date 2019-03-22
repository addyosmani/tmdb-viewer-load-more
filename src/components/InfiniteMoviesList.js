
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import MovieCard from '../containers/MovieCard';

const ITEM_WIDTH = 400;
const ITEM_HEIGHT = 360;

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

function generateIndexesForRow(rowIndex, maxItemsPerRow, itemsAmount) {
  const result = [];
  const startIndex = rowIndex * maxItemsPerRow;

  for (let i = startIndex; i < Math.min(startIndex + maxItemsPerRow, itemsAmount); i++) {
    result.push(i);
  }

  return result;
}

function getMaxItemsAmountPerRow(width) {
  return Math.max(Math.floor(width / ITEM_WIDTH), 1);
}

function getRowsAmount(width, itemsAmount, hasMore) {
  const maxItemsPerRow = getMaxItemsAmountPerRow(width);

  return Math.ceil(itemsAmount/ maxItemsPerRow);
}

const RowItem = React.memo(function RowItem({movieId, classes}) {
  return (
    <Grid item className={classes.gridItem} key={movieId}>
      <MovieCard id={movieId} classes={{root: classes.card}} />
    </Grid>
  );
});

class InfiniteMoviesList extends PureComponent {
  constructor(props) {
    super(props);
    this._listWidth = 0.85 * window.innerWidth;
    this._listHeight = window.innerHeight - 132;
    this._listRef = React.createRef();
  }
  
  loadMoreItems = async () => {
    if (!this.props.isFetching) {
      try {
        await this.props.fetchMovies();
        const { movies, hasMore } = this.props;
        const rowCount = getRowsAmount(this._listWidth, movies.length, hasMore);
        this._listRef.current.scrollToItem(rowCount, "center");
      } catch(e) {
        console.log(e);
      }
    }
  };
  
  noItemsRenderer = () => (
    <Grid item>
      <Typography>No movies found</Typography>
    </Grid>
  );

  componentDidMount() {
    this.loadMoreItems();
  }

  componentDidUpdate(prevProps) {
    const { movies: prevMovies } = prevProps;
    const { movies, hasMore } = this.props;
    if(hasMore && prevMovies.length === 0 && movies.length === 0) {
      this.loadMoreItems();
    }
  }

  render() {
    const { classes, movies, hasMore } = this.props;

    const rowCount = getRowsAmount(this._listWidth, movies.length, hasMore);
    const loadMoreButton = (
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={this.loadMoreItems}
        style={{ marginBottom: '8px' }}
        fullWidth>
        Load More
      </Button>
    );

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
          itemSize={ITEM_HEIGHT}>
          {rowRenderer}
        </List>
        {hasMore && loadMoreButton}
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