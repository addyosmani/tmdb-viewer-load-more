import React from 'react';
import PropTypes from 'prop-types';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

export function withDataAutoload(WrappedComponent) {
  class WithDataAutoload extends React.Component {
    componentDidMount() {
      // console.log('dav : test [hoc/componentDidMount], props => ', this.props);
      // this.props.loadData();
    }

    componentDidUpdate(prevProps) {
      if (this.props.shouldReloadDataAfterUpdate && this.props.shouldReloadDataAfterUpdate(prevProps, this.props)) {
        // anton test added <
        console.log('dav : test [hoc/******componentDidUpdate], prevProps => ', prevProps);
        // this.props.loadData();
        // anton test added >
      }
    }

    render() {
      const {loadData, shouldReloadDataAfterUpdate, ...otherProps} = this.props;

      return <WrappedComponent {...otherProps} />;
    }
  }

  WithDataAutoload.propTypes = {
    loadData: PropTypes.func.isRequired,
    shouldReloadDataAfterUpdate: PropTypes.func,
  };

  WithDataAutoload.displayName = `WithDataAutoload(${getDisplayName(WrappedComponent)})`;

  return WithDataAutoload;
}