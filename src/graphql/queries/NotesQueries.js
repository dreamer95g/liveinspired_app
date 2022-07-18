import {gql} from "@apollo/client";

export const NOTES = gql`
    query getNotes {
        Notes {
            id
            date
            text
            tags {
                id
                name
            }
        }
    }
`;

export const NOTE_BY_ID = gql`
    query getNoteById($id: ID!) {
        Note(id: $id) {
            date
            text
            tags {
                id
                name
            }
        }
    }
`;


export const NOTE_BY_TAG = gql`
    query noteByTag($tags: Mixed) {
        NoteByTag(
            tags: { column: ID, operator: IN, value: $tags }
        ) {
            id
            date
            text
            tags {
                id
                name
            }
        }
    }
`;
