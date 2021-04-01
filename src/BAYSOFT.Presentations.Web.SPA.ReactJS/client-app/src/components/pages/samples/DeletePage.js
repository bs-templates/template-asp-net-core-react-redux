import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Templates } from '../../templates';

class DeletePage extends Component {
    render() {
        return (
            <Templates.MaterialTemplate.DashboardLayout>
                <h4>Samples - Delete</h4>
                <hr />
            </Templates.MaterialTemplate.DashboardLayout>
        );
    }
}

const mapStateToProps = store => ({
    application: store.ApplicationState.application
});

const connectedComponent = connect(mapStateToProps)(DeletePage);

export const routes = [
    { private: false, name: "SAMPLES_DELETE", path: "/samples/delete", params: [], component: DeletePage }
];

export default connectedComponent;
