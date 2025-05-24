# @Chris-C-Brine/MRT-UI-Kit
[![npm version](https://img.shields.io/npm/v/@chris-c-brine/mrt-ui-kit.svg)](https://www.npmjs.com/package/@chris-c-brine/mrt-ui-kit)
[![License: AAL](https://img.shields.io/badge/License-AAL-blue.svg)](https://github.com/Chris-C-Brine/MRT-UI-Kit/blob/main/LICENSE)

A UI component library built on top of Material React Table (MRT V3) that provides additional table editing features and customized components.

---

## Features
- **Enhanced Table Editing Components**: Customized cell editing components for Material React Table
    - MRT_EditCellDatePicker integration with MUI X Date Pickers & Day.js
    - MRT_EditCellAutocomplete field with improved handling
    - MRT_EditCellTextarea for multi-line editing
    - MRT_EditCellTextField 
- **Edit Dialog**: A full-featured dialog for editing table rows
- **AutoGrid Integration**: Seamless integration with for responsive layouts `@chris-c-brine/autogrid`

---

## Installation
```shell
  npm install @chris-c-brine/mrt-ui-kit
```

---

### Peer Dependencies

This package requires the following peer dependencies:

```shell script
  npm install react react-dom @mui/material material-react-table
```

---

## Components

| Component                  | Description                                                                |
|----------------------------|----------------------------------------------------------------------------|
| `MRT_EditCellAutocomplete` | An enhanced Autocomplete component for editing cells                       |
| `MRT_EditCellDatePicker`   | Date picker integration with MUI X Date Pickers                            |
| `MRT_EditCellTextarea`     | Multi-line text editor for table cells                                     |
| `MRT_EditCellTextField`    | Enhanced text field with validation                                        |
| `MRT_EditDialog`           | Dialog for editing / viewing table rows with validation and custom layouts |

## TypeScript Support
This library is built with TypeScript and provides full type definitions for all components.

---

## License

[AAL](LICENSE) © Christopher C. Brine
