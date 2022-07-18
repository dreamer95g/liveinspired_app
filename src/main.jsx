import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import "animate.css";

import { TrackingApp } from "./TrackingApp";
import { apollo_client } from "./config/apollo";

import { ApolloProvider } from "@apollo/client";

ReactDOM.render(
  <ApolloProvider client={apollo_client}>
    <TrackingApp />,
  </ApolloProvider>,

  document.getElementById("root")
);
