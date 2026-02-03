import { AppConfig } from './config.model';

export const DEFAULT_CUSTOMER_CONFIG: AppConfig = {
  theme: {
    primaryColor: '#1565c0',
    fontFamily: '"Segoe UI", sans-serif',
  },
  table: {
    columns: [
      { key: 'id', label: 'ID', visible: true },
      { key: 'name', label: 'Name', visible: true },
      { key: 'email', label: 'Email', visible: true },
      { key: 'role', label: 'Role', visible: true },
      { key: 'status', label: 'Status', visible: true },
    ],
    showExportButton: true,
    showFilterBar: true,
    rowsPerPage: 10,
  },
  features: {
    enableContextMenu: true,
    enableRowSelection: true,
  },
};

export const MINIMAL_CUSTOMER_CONFIG: AppConfig = {
  theme: {
    primaryColor: '#2e7d32',
    fontFamily: '"Courier New", monospace',
  },
  table: {
    columns: [
      { key: 'id', label: 'ID', visible: true },
      { key: 'name', label: 'Name', visible: true },
      { key: 'email', label: 'Email', visible: false },
      { key: 'role', label: 'Role', visible: false },
      { key: 'status', label: 'Status', visible: false },
    ],
    showExportButton: false,
    showFilterBar: false,
    rowsPerPage: 5,
  },
  features: {
    enableContextMenu: false,
    enableRowSelection: false,
  },
};
