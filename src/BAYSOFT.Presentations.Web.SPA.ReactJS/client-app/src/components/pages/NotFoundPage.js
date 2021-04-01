import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Templates } from '../templates';

import { Typography } from '@material-ui/core';

class NotFoundPage extends Component {
    render() {
        return (
            <Templates.MaterialTemplate.DashboardLayout>
                <Typography variant="h6" noWrap>Not found!</Typography>
            </Templates.MaterialTemplate.DashboardLayout>
        );
    }
}

const mapStateToProps = store => ({
    application: store.ApplicationState.application
});

export default connect(mapStateToProps)(NotFoundPage);