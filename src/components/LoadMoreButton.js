import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';

const LoadMoreButton = ({ showLoadMore, loadMoreItems }) => {
  if(!showLoadMore) {
    return null;
  }
  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={loadMoreItems}
        style={{ marginBottom: '8px' }}
        fullWidth>
        Load More
      </Button>
    </Fragment>
  );
};

export default LoadMoreButton;