import { gql } from "@apollo/client";

export const BACKUP_DATA = gql`
  mutation BackupData($dir: String) {
    backupData(dir: $dir) {
      result
    }
  }
`;

export const RESTORE_DATA = gql`
  mutation ($backup: String) {
    restoreData(backup: $backup) {
      result
    }
  }
`;
