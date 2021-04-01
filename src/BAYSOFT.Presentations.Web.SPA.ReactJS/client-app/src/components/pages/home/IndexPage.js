import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Templates } from '../../templates';

import {
    Typography,
    Button
} from '@material-ui/core';
import { CreateApiService, CreateApiFilter } from '../../../state/actions/apiModelWrapper/actions';

import { ApplicationDialogAlert, ApplicationDialogShow, ApplicationDialogClose, ApplicationDialogAddAction } from '../../../state/actions/application/actions';

const IndexPage = (props) => {
    const { collections, entities } = props;
    console.log(collections);
    console.log(entities);

    const handleClickGetByFilter = (collection, query) => () => {
        let endPoint = `https://localhost:4101/api/${collection}`;
        console.log(`Call: ${endPoint}`);

        const api = props.CreateApiService(`${collection}-service`, endPoint);
        const filter = props.CreateApiFilter(`${collection}-service-filter`);

        api.GetByFilter(filter);

        let actions = [];
        console.log(props.ApplicationDialogAddAction);
        actions.push(props.ApplicationDialogAddAction('Disagree', 'text', 'default', () => { props.ApplicationDialogClose(); }));
        actions.push(props.ApplicationDialogAddAction('Agree', 'text', 'primary', () => { props.ApplicationDialogClose(); }));

        props.ApplicationDialogShow('Agreement', 'Do you agree to get data form our api?', actions);
    };

    const handleClickGetByID = (collection, id) => () => {
        let endPoint = `https://localhost:4101/api/${collection}`;
        console.log(`Call: ${endPoint}/${id}`);

        const api = props.CreateApiService(`${collection}-service`, endPoint);

        api.GetById(id);

        props.ApplicationDialogAlert("Alerta", "Você clicou em obter por ID");
    };
    return (
        <Templates.MaterialTemplate.DashboardLayout>
            <Typography variant="h6" noWrap>
                Home/Index - data...
            </Typography>
            <hr />
            <Button variant="contained" color="secondary">Color?</Button>
            <hr />
            <Typography noWrap>api/samples</Typography>
            <Button variant="contained" color="primary" onClick={handleClickGetByFilter('samples', 'samp')}>GET api/samples</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetByID('samples', 1)}>GET api/samples/1</Button>
            <hr />
            <Typography noWrap>api/sectors</Typography>
            <Button variant="contained" color="primary" onClick={handleClickGetByFilter('sectors', 'sect')}>GET api/sectors</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetByID('sectors', 1)}>GET api/sectors/1</Button>
            <hr />
            <Typography noWrap>api/subsectors</Typography>
            <Button variant="contained" color="primary" onClick={handleClickGetByFilter('subsectors', 'subs')}>GET api/subsectors</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetByID('subsectors', 1)}>GET api/subsectors/1</Button>
            <hr />
            <Typography noWrap>api/stocks</Typography>
            <Button variant="contained" color="primary" onClick={handleClickGetByFilter('stocks', 'subs')}>GET api/stocks</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetByID('stocks', 1)}>GET api/stocks/1</Button>
        </Templates.MaterialTemplate.DashboardLayout>
    );
}

const mapStateToProps = store => ({
    application: store.ApplicationState.application,
    collections: store.ApiModelWrapperState.queries.collections,
    entities: store.ApiModelWrapperState.queries.entities,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({
        CreateApiService,
        CreateApiFilter,
        ApplicationDialogShow, ApplicationDialogClose, ApplicationDialogAddAction, ApplicationDialogAlert
    }, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(IndexPage);

export const routes = [
    { private: false, name: "HOME", path: "/home", params: [], component: connectedComponent },
    { private: false, name: "HOME_INDEX", path: "/home/index", params: [], component: connectedComponent }
];

export default connectedComponent;
