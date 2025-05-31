import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import "animate.css";

import { InspiredApp } from "./InspiredApp";
import { apollo_client } from "./config/apollo";

import { ApolloProvider } from "@apollo/client";


ReactDOM.render(
  <ApolloProvider client={apollo_client}>
    <InspiredApp />
  </ApolloProvider>,

  document.getElementById("root")
);
