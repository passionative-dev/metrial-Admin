import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateBrand from './CreateBrand';
import BrandList from './BrandsList';

function PageECommerceBrand() {
  return (
    <Switch>
      <Route path='/app/ecommerce/brands' exact component={BrandList}></Route>
      <Route
        path='/app/ecommerce/brands/create'
        component={CreateBrand}
      ></Route>
      <Route
        path='/app/ecommerce/brands/edit/:id'
        component={CreateBrand}
      ></Route>
    </Switch>
  );
}

export default PageECommerceBrand;
