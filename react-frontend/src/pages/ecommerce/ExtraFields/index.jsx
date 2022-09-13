import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import ExtraFieldsList from "./ExtraFieldsList"
import CreateExtraFelds from "./CreateExtraFields";

function PageExtraFields() {
  return (
    <Switch>
      <Route
        path='/app/ecommerce/extra_fields'
        exact
        component={ExtraFieldsList}
      ></Route>
      <Route
        path='/app/ecommerce/extra_fields/create'
        component={CreateExtraFelds}
      ></Route>
      <Route
        path='/app/ecommerce/extra_fields/edit/:id'
        component={CreateExtraFelds}
      ></Route>
    </Switch>
  );
}

export default PageExtraFields;
