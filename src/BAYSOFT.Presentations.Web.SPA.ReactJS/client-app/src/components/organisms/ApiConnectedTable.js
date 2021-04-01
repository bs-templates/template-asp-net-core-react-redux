import React, { useEffect, useState, useCallback } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { debounce } from 'debounce';
import { CreateApiService, CreateApiFilter } from '../../state/actions/apiModelWrapper/actions';

import {
    lighten,
    fade,
    makeStyles,
    Paper,
    Toolbar,
    Tooltip,
    Typography,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableSortLabel,
    TableBody,
    TablePagination,
    InputBase
} from '@material-ui/core';

import {
    Delete,
    Edit,
    FilterList,
    Add,
    Search
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    mainRoot: {
        width: '100%',
    },
    mainPaper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    mainTable: {
        minWidth: 400,
    },
    mainVisuallyHidden: {
        border: 0,
        clip: 'rect(0,0,0,0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    toolbarRoot: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    toolbarHighlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    toolbarTitle: {
        flex: '1 1 100%',
    },
    tableHeadRoot: {
        fontWeight: 'bold'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.05),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.10),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const ApiConnectedTable = props => {
    const { config } = props;
    const { collections } = props;
    const classes = useStyles();
    const [requestUrl, setRequestUrl] = useState(config.endPoint);
    const [response, setResponse] = useState(null);

    const api = props.CreateApiService(`${config.configId}-service`, config.endPoint);
    const filter = props.CreateApiFilter(`${config.configId}-filter`);

    const [query, setQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [pageRowCount, setPageRowCount] = useState(config.defaultPageSize);
    const [hasAllLinesChecked, setHasAllLinesChecked] = useState(false);
    const [hasLinesChecked, setHasLinesChecked] = useState(false);
    const emptyRows = response ? response.request.pagination.size - response.data.length : config.defaultPageSize;
    const loadData = () => {
        let url = api.GetByFilter(filter);
        setRequestUrl(url);
    };
    const debounceQuery = useCallback(debounce((value) => {
        let strict = response ? response.request.searchProperties.strict : false;
        let phrase = response ? response.request.searchProperties.phrase : false;
        filter.setSearch(value, strict, phrase);
        loadData();
    }, 3000, false), []);
    const handleRequestSort = (property) => (event) => {
        const isAscending = property === response.request.ordenation.orderBy && response.request.ordenation.order === 'ascending';
        const order = isAscending ? 'descending' : 'ascending';

        filter.setOrdenation(property, order);

        loadData();
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = response.data.map((value) => value[config.id]);
            setSelectedRows(newSelecteds);
            setHasAllLinesChecked(true);
            setHasLinesChecked(false);
            return;
        }
        setSelectedRows([]);
    };
    const handleClick = (event, id) => {
        const selectedIndex = selectedRows.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }
        setSelectedRows(newSelected);
    };
    const handleChangePage = (event, newPage) => {
        filter.setPagination(response.request.pagination.size, newPage + 1);

        loadData();
    };
    const handleChangeRowsPerPage = (event) => {
        filter.setPagination(event.target.value, 1);

        loadData();
    };
    const handleClickAdd = (event) => {
        config.actions['add'].handler();
    };
    const handleClickFilter = (event) => {
        console.log('click: handleClickFilter');
    };
    const handleClickEdit = (id) => (event) => {
        config.actions['edit'].handler(id);
    };
    const handleClickDelete = (event) => {
        config.actions['delete'].handler(selectedRows, () => {
            if (selectedRows.length === response.data.length) {
                handleChangePage(null, (response.request.pagination.number - 2));
            }

            setSelectedRows([]);
        });
    };
    const handleQuery = (event) => {
        setQuery(event.target.value);
    };
    const allowAction = (action) => {
        return config.actions !== undefined && config.actions[action] !== undefined;
    }
    useEffect(() => {
        loadData();
    });
    useEffect(() => {
        if (collections && collections[requestUrl] && collections[requestUrl].response) {
            setResponse(collections[requestUrl].response);
            setPageRowCount(collections[requestUrl].response.data.length);
        }
    }, [collections, requestUrl])
    useEffect(() => {
        setHasAllLinesChecked(selectedRows.length === pageRowCount);
        setHasLinesChecked(selectedRows.length < pageRowCount && selectedRows.length > 0);
    }, [selectedRows, pageRowCount]);
    useEffect(() => {
        debounceQuery(query);
    }, [query, debounceQuery]);
    return (
        <div className={classes.mainRoot}>
            <Paper className={classes.mainPaper}>
                <Toolbar
                    className={clsx(classes.toolbarRoot, {
                        [classes.toolbarHighlight]: selectedRows.length > 0,
                    })}
                >
                    {selectedRows.length > 0 ? (
                        <Typography className={classes.toolbarTitle} color="inherit" variant="subtitle1" component="div">
                            {selectedRows.length} {selectedRows.length > 1 ? 'itens selecionados' : 'item selecionado'}
                        </Typography>
                    ) : (
                            <Typography className={classes.toolbarTitle} variant="h6" id="tableTitle" component="div">
                                {config.title}
                            </Typography>
                        )}
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <Search />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            value={query}
                            onChange={handleQuery}
                        />
                    </div>

                    {allowAction('edit') && selectedRows.length > 0 && selectedRows.length === 1 ? (
                        <Tooltip title="Editar">
                            <IconButton aria-label="edit" onClick={handleClickEdit(selectedRows[0])}>
                                <Edit />
                            </IconButton>
                        </Tooltip>) : (null)
                    }

                    {allowAction('delete') && selectedRows.length > 0 ? (
                        <Tooltip title="Excluir">
                            <IconButton aria-label="delete" onClick={handleClickDelete}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    ) : (
                            <React.Fragment>
                                {allowAction('add') ? (
                                    <Tooltip title="Add item">
                                        <IconButton aria-label="add item" onClick={handleClickAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>) : null}
                                {allowAction('filter') ? (
                                    <Tooltip title="Filter list">
                                        <IconButton aria-label="filter list" onClick={handleClickFilter}>
                                            <FilterList />
                                        </IconButton>
                                    </Tooltip>) : null}
                            </React.Fragment>
                        )}
                </Toolbar>
                <TableContainer>
                    <Table
                        className={classes.mainTable}
                        aria-labelledby="tableTitle"
                        size={config.dense ? 'small' : 'medium'}
                        aria-label="api table"
                    >
                        <TableHead className={classes.tableHeadRoot}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={hasLinesChecked}
                                        checked={hasAllLinesChecked}
                                        onChange={handleSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all desserts' }}
                                    />
                                </TableCell>
                                {
                                    config.columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.isNumeric ? 'right' : 'left'}
                                            padding={column.disablePadding ? 'none' : 'default'}
                                            sortDirection={response && response.request.ordenation.orderBy === column.id ? response.request.ordenation.order === 'ascending' ? 'asc' : 'desc' : false}
                                        >
                                            <TableSortLabel
                                                style={{ fontWeight: 'bold' }}
                                                active={response && response.request.ordenation.orderBy === column.id}
                                                direction={response && response.request.ordenation.orderBy === column.id ? response.request.ordenation.order === 'ascending' ? 'asc' : 'desc' : 'asc'}
                                                onClick={handleRequestSort(column.id)}
                                            >
                                                {column.label}
                                                {response && response.request.ordenation.orderBy === column.id ? (
                                                    <span className={classes.mainVisuallyHidden}>
                                                        {response.request.ordenation.order === 'ascending' ? 'sorted ascending' : 'sorted descending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {response && response.statusCode === 200 ? response.data.map((value, index) => {
                                const isItemSelected = selectedRows.indexOf(value[config.id]) !== -1;
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, value[config.id])}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={value[config.id]}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </TableCell>
                                        {config.columns.map(column => {
                                            const cellId = column.id + '-' + value[config.id];
                                            return (<TableCell key={cellId} align={column.isNumeric ? 'right' : 'left'}>{value[column.id]}</TableCell>)
                                        })}

                                    </TableRow>
                                )
                            }) : null}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (config.dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {response && response.statusCode === 200 ? (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={response.resultCount}
                        rowsPerPage={response.request.pagination.size}
                        page={response.request.pagination.number - 1}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />)
                    : null}
            </Paper>
        </div>
    );
};

const mapStateToProps = store => ({
    application: store.ApplicationState.application,
    collections: store.ApiModelWrapperState.queries.collections
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({
        CreateApiService,
        CreateApiFilter
    }, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ApiConnectedTable);

export default connectedComponent;
