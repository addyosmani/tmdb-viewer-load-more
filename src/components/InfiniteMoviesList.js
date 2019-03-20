import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
// import {InfiniteLoader, List, WindowScroller, AutoSizer} from 'react-virtualized';
// import { WindowScroller, AutoSizer } from "react-virtualized";
import MovieCard from '../containers/MovieCard';

import Button from '@material-ui/core/Button';

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

  return Math.ceil(itemsAmount/ maxItemsPerRow) + (hasMore ? 1 : 0);
}

const RowItem = React.memo(function RowItem({movieId, classes}) {
  return (
    <Grid item className={classes.gridItem} key={movieId}>
      <MovieCard id={movieId} classes={{root: classes.card}} />
    </Grid>
  );
});



class InfiniteMoviesList extends React.PureComponent {

  loadMoreItems = () => {
    if (!this.props.isFetching) {
      this.props.fetchMovies();
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
    const { hasMore, movies : prevMovies } = prevProps;
    const { movies } = this.props;
    if(hasMore && prevMovies.length === 0 && movies.length === 0) {
      this.loadMoreItems();
    }
  }

  render() {
    const {classes} = this.props;
    const width = 0.85 * window.innerWidth;
    const height = window.innerHeight;
    const {movies, hasMore} = this.props;
    const rowCount = getRowsAmount(width, movies.length, hasMore);
    const loadMoreButton = (
      hasMore ?
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={this.loadMoreItems}
        style={{marginBottom: '10px'}}
        fullWidth >
        Load More
      </Button> : null
    );

    const rowRenderer = ({index, style}) => {
      const {movies, classes} = this.props;
      const maxItemsPerRow = getMaxItemsAmountPerRow(width);
      const moviesIds = generateIndexesForRow(index, maxItemsPerRow, movies.length).map(movieIndex => movies[movieIndex]);
    
      return (
        <div style={style} className={classes.row}>
          {moviesIds.map(movieId => (
            <RowItem key={movieId} movieId={movieId} classes={classes}/>
          ))}
        </div>
      )
    };

    return (
      <React.Fragment>
        <List
          className={classes.grid}
          height={height}
          width={width}
          itemCount={rowCount}
          itemSize={ITEM_HEIGHT}
        >
          {rowRenderer}
        </List>
        {loadMoreButton}
      </React.Fragment>
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
