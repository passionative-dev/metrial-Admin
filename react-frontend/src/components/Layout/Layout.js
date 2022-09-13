import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';

import { Fab } from '@mui/material';
import { connect } from 'react-redux';
// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';

import EditUser from '../../pages/user/EditUser';
import AddUser from '../../pages/CRUD/Users/form/UsersForm';

// pages
import Categories from '../../pages/categories';
import CategoriesCreate from '../../pages/categories/CategoryCreate';
import Country from '../../pages/country';
import CountryCreate from '../../pages/country/CountryCreate';
import Operation from '../../pages/operation';
import Analysis from '../../pages/analysis';
import AllOperation from '../../pages/alloperations';
import AllAnalysis from '../../pages/allanalysis';

import UploadFile from '../UploadFile';
import UploadAnalysis from '../UploadAnalysis';

import Ecommerce from '../../pages/ecommerce';
import PageExtraFields from '../../pages/ecommerce/ExtraFields';
import ProductBrand from '../../pages/ecommerce/Brand';
import Product from '../../pages/ecommerce/Products';
import ProductsGrid from '../../pages/ecommerce/ProductsGrid';
import CreateProduct from '../../pages/ecommerce/CreateProduct';

import BreadCrumbs from '../../components/BreadCrumbs';

// context
import { useLayoutState } from '../../context/LayoutContext';
import { ProductsProvider } from '../../context/ProductContext';

import UsersFormPage from 'pages/CRUD/Users/form/UsersFormPage';
import UsersTablePage from 'pages/CRUD/Users/table/UsersTablePage';

//Sidebar structure
import structure from '../Sidebar/SidebarStructure';

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar structure={structure} />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <BreadCrumbs />
        <Switch>
          <Route path='/app/country/edit/:id' component={CountryCreate} />
          <Route path='/app/country/create' component={CountryCreate} />
          <Route path='/app/country' component={Country} />

          <Route path='/app/categories/edit/:id' component={CategoriesCreate} />
          <Route path='/app/categories/create' component={CategoriesCreate} />
          <Route path='/app/categories' component={Categories} />

          <Route path='/app/operation' component={Operation} />
          <Route path='/app/analysis' component={Analysis} />
          <Route path='/app/alloperations' component={AllOperation} />
          <Route path='/app/allanalysis' component={AllAnalysis} />

          <Route path='/app/uploadfile' component={UploadFile} />
          <Route path='/app/uploadanalysis' component={UploadAnalysis} />
          <Route path='/app/user/edit' component={EditUser} />

          <Route path='/app/ecommerce/brands' component={ProductBrand}></Route>
          <Route
            path='/app/ecommerce/extra_fields'
            component={PageExtraFields}
          ></Route>
          <Route path='/app/ecommerce/management' exact>
            <ProductsProvider>
              <Ecommerce />
            </ProductsProvider>
          </Route>
          <Route path='/app/ecommerce/management/edit/:productId' exact>
            <ProductsProvider>
              <CreateProduct />
            </ProductsProvider>
          </Route>
          <Route path='/app/ecommerce/management/create'>
            <ProductsProvider>
              <CreateProduct />
            </ProductsProvider>
          </Route>
          <Route path='/app/ecommerce/product/:id' component={Product} />
          <Route path='/app/ecommerce/product' component={Product} />
          <Route path='/app/ecommerce/gridproducts' component={ProductsGrid} />

          <Route path={'/app/users'} exact component={UsersTablePage} />
          <Route path={'/app/user/new'} exact component={AddUser} />
          <Route path={'/app/users/:id/edit'} exact component={UsersFormPage} />
        </Switch>
        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
      </div>
    </div>
  );
}

export default withRouter(connect()(Layout));
