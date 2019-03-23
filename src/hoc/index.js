import React from 'react';
import PropTypes from 'prop-types';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

export function withDataAutoload(WrappedComponent) {
  class WithDataAutoload extends React.Component {

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