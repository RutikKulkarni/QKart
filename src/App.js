import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"

export const config = {
  endpoint: `https://qkart-frontend-bup8.onrender.com/api/v1`,
  // endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    // <div className="App">
    //     <Register />
    // </div>
    // {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
    <div className="App">
      <Switch>
        <Route  path="/register">
          <Register />
        </Route>

        <Route  path="/login">
          <Login />
        </Route>

        <Route exact path="/">
          <Products /> 
        </Route>

        <Route path="/checkout">
          <Checkout />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
