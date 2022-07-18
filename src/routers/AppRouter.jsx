import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { DashboardLayout } from "../components/ui/DashboardLayout";
import { LoginScreen } from "../components/auth/LoginScreen";
import { useSelector, useDispatch } from "react-redux";
import { useLazyQuery, gql } from "@apollo/client";
import { LogInAction } from "../actions/auth";

import { ME } from "../graphql/queries/AuthQueries";
import { apollo_client } from "../config/apollo";
import { Loading } from "../components/ui/Loading";

export const AppRouter = () => {
  //   const [whoIam, { data: me }] = useLazyQuery(ME);
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState("");

  const { token } = useSelector((state) => state.auth);
  //const token = localStorage.getItem("_token");
  //observer
  useEffect(async () => {
    if (token !== undefined) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  useEffect(() => {
    // alert(`isAuthenticated es ${isAuthenticated}`);
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      setIsAuthenticated("");
    };
  }, []);

  useEffect(() => {
    if (token !== undefined) {
      //   console.log(localStorage.getItem("_token"));
      try {
        apollo_client
          .query({
            query: ME,
          })
          .then((response) => {
            console.log(response.data.me);
            const access_token = token;
            const { name, email, images } = response.data.me;

            dispatch(LogInAction(access_token, name, email, images[0].name));
            setIsAuthenticated(true);
          });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div>
      <Router>
        {isAuthenticated === "" ? (
          <div className="my-64">
            <Loading />
          </div>
        ) : (
          <div className="my-auto ">
            <Switch>
              {(isAuthenticated === false || isAuthenticated === true) && (
                <Route exact path="/auth/login" component={LoginScreen} />
              )}

              {isAuthenticated === true ? (
                <Route path="/dashboard" component={DashboardLayout} />
              ) : (
                <Redirect to="/auth/login" />
              )}
            </Switch>
          </div>
        )}
      </Router>
    </div>
  );
};
