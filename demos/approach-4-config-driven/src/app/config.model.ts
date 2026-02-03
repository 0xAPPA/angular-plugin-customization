export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export interface AppConfig {
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  table: {
    columns: ColumnConfig[];
    showExportButton: boolean;
    showFilterBar: boolean;
    rowsPerPage: number;
  };
  features: {
    enableContextMenu: boolean;
    enableRowSelection: boolean;
  };
}
