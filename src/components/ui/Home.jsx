import { Slider } from "./Slider";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
// import { CONTACTS } from "../../graphql/queries/ContactsQueries";
// import { ORGANIZATIONS } from "../../graphql/queries/OrganizationsQueries";
// import { FOREIGN_MISSIONS } from "../../graphql/queries/ForeignMissionsQueries";

import { apollo_client } from "../../config/apollo";

export const Home = ({ history }) => {
  const [contacts, setContacts] = useState("0");
  const [organizations, setOrganizations] = useState("0");
  const [foreignMissions, setTrackings] = useState("0");

  // const { data: contactsFromServer } = useQuery(CONTACTS);
  // const { data: organizationsFromServer } = useQuery(ORGANIZATIONS);
  // const { data: foreignMissionsFromServer } = useQuery(FOREIGN_MISSIONS);
  //
  // const refetch = async () => {
  //   await apollo_client.refetchQueries({
  //     include: [CONTACTS, ORGANIZATIONS, FOREIGN_MISSIONS],
  //   });
  // };

  // useEffect(() => {
  //   if (contactsFromServer !== undefined && contactsFromServer !== null) {
  //     const { contacts } = contactsFromServer;
  //     if (contacts !== null && contacts !== undefined)
  //       setContacts(contacts.length);
  //   }
  //
  //   if (
  //     organizationsFromServer !== undefined &&
  //     organizationsFromServer !== null
  //   ) {
  //     const { organizations } = organizationsFromServer;
  //     if (organizations !== null && organizations.length !== 0)
  //       setOrganizations(organizations.length);
  //   }
  //
  //   if (
  //     foreignMissionsFromServer !== undefined &&
  //     foreignMissionsFromServer !== null
  //   ) {
  //     const { foreignMissions } = foreignMissionsFromServer;
  //     if (foreignMissions !== null && foreignMissions !== undefined)
  //       setTrackings(foreignMissions.length);
  //   }
  // }, [contactsFromServer, organizationsFromServer, foreignMissionsFromServer]);
  //
  // useEffect(() => {
  //   refetch();
  // }, []);

  return (
    <div>
      <div className="mt-0">
        <div className="flex flex-col mt-0">
          {" "}
          <div className="my-1 align-middle inline-block min-w-full shadow overflow-hidden rounded-lg sm:rounded-lg ">
            <Slider />
          </div>
        </div>

        <br></br>

        <div className="flex flex-wrap -mx-6 ">
          <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
            <div
              className="border-2 cursor-pointer border-gray-50 flex items-center px-5 py-6 shadow-lg rounded-lg bg-white"
              onClick={() => {
                history.push(`/dashboard/contacts`);
              }}
            >
              <div
                className="p-3 rounded-full bg-indigo-700 bg-opacity-75"
                onClick={() => {
                  history.push(`/dashboard/phrases`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold ">{contacts}</h4>
                <p
                  className="font-semibold cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    history.push(`/dashboard/notes`);
                  }}
                >
                  Frases
                </p>
              </div>
            </div>
          </div>

          {/*<div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">*/}
            {/*<div*/}
              {/*className="border-2 cursor-pointer border-gray-50 flex items-center px-5 py-6 shadow-lg rounded-lg bg-white"*/}
              {/*onClick={() => {*/}
                {/*history.push(`/dashboard/organizations`);*/}
              {/*}}*/}
            {/*>*/}
              {/*<div*/}
                {/*className="p-3 rounded-full bg-indigo-700 bg-opacity-75"*/}
                {/*onClick={() => {*/}
                  {/*history.push(`/dashboard/organizations`);*/}
                {/*}}*/}
              {/*>*/}
                {/*<svg*/}
                  {/*xmlns="http://www.w3.org/2000/svg"*/}
                  {/*class="h-8 w-8 text-white"*/}
                  {/*fill="none"*/}
                  {/*viewBox="0 0 23 23"*/}
                  {/*stroke="currentColor"*/}
                  {/*strokeWidth="2"*/}
                {/*>*/}
                  {/*<path*/}
                    {/*strokeLinecap="round"*/}
                    {/*strokeLinejoin="round"*/}
                    {/*d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"*/}
                  {/*/>*/}
                {/*</svg>*/}
              {/*</div>*/}

              {/*<div className="mx-5">*/}
                {/*<h4 className="text-2xl font-semibold ">{organizations}</h4>*/}
                {/*<p*/}
                  {/*className="font-semibold cursor-pointer hover:text-blue-700"*/}
                  {/*onClick={() => {*/}
                    {/*history.push(`/dashboard/organizations`);*/}
                  {/*}}*/}
                {/*>*/}
                  {/*Versos Bíblicos{" "}*/}
                {/*</p>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}

          {/*<div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0 ">*/}
            {/*<div*/}
              {/*className="border-2 cursor-pointer border-gray-50 flex items-center px-5 py-6 shadow-lg rounded-lg bg-white"*/}
              {/*onClick={() => {*/}
                {/*history.push(`/dashboard/missions`);*/}
              {/*}}*/}
            {/*>*/}
              {/*<div*/}
                {/*className="p-3 rounded-full bg-indigo-700 bg-opacity-75 "*/}
                {/*onClick={() => {*/}
                  {/*history.push(`/dashboard/missions`);*/}
                {/*}}*/}
              {/*>*/}
                {/*<svg*/}
                  {/*xmlns="http://www.w3.org/2000/svg"*/}
                  {/*class="h-8 w-8 text-white"*/}
                  {/*fill="none"*/}
                  {/*viewBox="0 0 24 24"*/}
                  {/*stroke="currentColor"*/}
                  {/*strokeWidth="2"*/}
                {/*>*/}
                  {/*<path*/}
                    {/*strokeLinecap="round"*/}
                    {/*strokeLinejoin="round"*/}
                    {/*d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"*/}
                  {/*/>*/}
                {/*</svg>*/}
              {/*</div>*/}

              {/*<div className="mx-5 ">*/}
                {/*<h4 className="text-2xl font-semibold ">{foreignMissions}</h4>*/}
                {/*<p*/}
                  {/*className="font-semibold cursor-pointer hover:text-blue-700"*/}
                  {/*onClick={() => {*/}
                    {/*history.push(`/dashboard/missions`);*/}
                  {/*}}*/}
                {/*>*/}
                  {/*Notas{" "}*/}
                {/*</p>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
        </div>
        <br />
        {/* <div>
          <h1 className="text-center text-3xl my-10">
            Aun en desarrollo
            <p className="text-blue-600 animate-pulse text-6xl font-semibold">
              {text}
            </p>
          </h1>
        </div> */}
        <br />
      </div>
    </div>
  );
};
