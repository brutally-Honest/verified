import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "./store/configureStore";
import { Provider } from "react-redux";


const store = configureStore();
store.subscribe(() => {
  console.log("store updated", store.getState());
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>

)
