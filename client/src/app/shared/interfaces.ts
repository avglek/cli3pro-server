import { SortModelItem } from 'ag-grid-community';
import { ISimpleFilterModelType } from 'ag-grid-community/dist/lib/filter/provided/simpleFilter';

export interface User {
  user: string;
  password: string;
}

export interface ITreeNode {
  docId: number;
  docName: string;
  imgIndex: number;
  lev: number;
  ordering: number;
  parentId: number;
  selIndex: number | null;
  open?: boolean;
  selected?: boolean;
  disabled?: boolean;
  roleName?: string;
  children?: ITreeNode[];
}

export interface ITreeDocs {
  docId: number;
  docName: string;
  imgIndex: number;
  ordering: number;
  parentId: number;
  roleName?: string;
  prognoz: number | null;
}

export interface ITabData {
  uid?: string;
  docId?: number;
  title?: string;
  isLoading?: boolean;
  isForm?: boolean;
  isOnFilter?: boolean;
  reportType?: TypeReport;
  params?: IDescParam[];
  description?: IDescDescription;
  procName?: string;
  isSuccess?: boolean;
  errorMessage?: string;
  data?: any;
  isVerticalOrient?: boolean;
  owner?: string;
  statusRowCount?: string;
  toExport?: (value: string) => void;
  toPrint?: () => void;
}

export enum TypeReport {
  Table = 'TfrmTable',
  TwoTables = 'TfrmTwoTables',
  Text = 'TfrmText',
  XLReport = 'TfrmXLReport',
  Flash = 'TfrmFlash',
}

export enum TypeData {
  Cursor = 'REF_CURSOR',
  String = 'VARCHAR2',
}

export enum TypeOut {
  In = 'IN',
  Out = 'OUT',
}

export interface IDesc {
  id: number;
  description: IDescDescription;
  procName: string;
  form: 'Y' | 'N';
  params: IDescParam[];
}
/********************
 * 0.0 Edit
 * 1.0 Date
 * 2.0 Combo
 * 3.0 LookupCombo (tab NCI)
 * 4.0 Memo
 * 5.0 DateTime
 * 6.0 SpinEdit
 * 7.0 RadioGroup
 * 8.0 ImageIndex
 * 9.0 Boolean
 * 10.0 RadioButton
 * 13.0 MultiEdit
 * 11.0 Group
 */
export enum UIControlType {
  UIEdit = 0,
  UIDate = 1,
  UICombo = 2,
  UILookupCombo = 3, // (tab NCI)
  UIMemo = 4,
  UIDateTime = 5,
  UISpinEdit = 6,
  UIRadioGroup = 7,
  UIImageIndex = 8,
  UIBoolean = 9,
  UIRadioButton = 10,
  UIMultiEdit = 13,
  UIGroup = 11,
}

export interface IDescDescription {
  docId?: number;
  docName?: string;
  roleName?: string | null;
  isFolder?: 'F' | 'T';
  cmdText?: string | null;
  cmdType?: string | null;
  docClass?: TypeReport;
  imgIndex?: number | null;
  docTitle?: string | null;
  dlgClass?: string | null;
  selIndex?: number | null;
  redirectDoc_id?: number | null;
  options?: number | null;
  ordering?: number | null;
  postProc?: string | null;
  schedule?: string | null;
  prognoz?: string | null;
}

export interface IDescParam {
  objectOwner?: string | null;
  packageName?: string | null;
  objectName?: string | null;
  argumentName?: string | null;
  position?: number;
  dataType?: string | null;
  inOut?: string | null;
  fieldName?: string;
  docId?: number;
  fieldKind?: number;
  displayLabel?: string | null;
  displaySize?: number;
  controlType?: number;
  defaultValue?: string | null;
  itemList?: string | null;
  readonly?: 'T' | 'F' | null;
  lookupTable?: string | null;
  visible?: 'T' | 'F';
  lookupKeyfields?: string | null;
  required?: string | null;
  lookupTableorder?: string | null;
  lookupResultfield?: string | null;
  displayFormat?: string | null;
  footerFunc?: string | null;
  frozeColumn?: string | null;
  keyField?: string | null;
  moveDlg?: string | null;
  lookupDisplayfields?: string | null;
  nciTable?: string | null;
  disableSort?: string | null;
  options?: number;
  editMask?: string | null;
  dlgClass?: string | null;
  calcClass?: string | null;
  groupedFields?: string | null;
  validClass?: string | null;
  lookupMasterfield?: string | null;
  funcClass?: string | null;
  titleHint?: string | null;
  paramVisible?: 'T' | 'F';
  value?: any;
}
export interface ICursorData {
  fields: IField[];
  rows: any[];
  type: string;
  count: number;
}

export interface IClobData {
  data: string;
  type: string;
}

export interface IStringData {
  data: string;
  type: string;
}

export interface IData {
  uid: string;
  data: {
    [key: string]: ICursorData | IClobData | IStringData;
  };
}

export interface IProcParam {
  name?: string | null;
  type?: string | null;
  position?: number;
  inOut?: string | null;
  value?: any;
  start?: number;
  end?: number;
  sorting?: SortModelItem[];
  filter?: FilterModelItem[];
}
export interface FilterModelItem {
  colId: string;
  value: string | number;
  valueTo?: string | number;
  type?: ISimpleFilterModelType;
  filterType?: string;
  dateFrom?: string; //always YYYY-MM-DD hh:mm:ss e.g. 2019-05-24 00:00:00
  dateTo?: string;
  optionType?: ISimpleFilterModelType;
}

export enum FilterProcType {
  equals,
  includes,
}

export interface IField {
  displayLabel?: string;
  displaySize?: number;
  docId?: number;
  fieldName?: string;
  keyField?: string | null;
  lookupKeyfields?: string | null;
  nciTable?: string | null;
  visible?: 'F' | 'T';
  order: number;
  calcClass?: string | null;
  controlType?: number;
  defaultValue?: string | null;
  disableSort?: 'F' | 'T';
  displayFormat?: string | null;
  dlgClass?: string | null;
  editMask?: string | null;
  fieldKind?: number;
  footerFunc?: string | null;
  frozeColumn?: 'F' | 'T';
  funcClass?: string | null;
  groupedFields?: string | null;
  itemList?: string | null;
  lookupDisplayfields?: string | null;
  lookupMasterfield?: string | null;
  lookupResultfield?: string | null;
  lookupTable?: string | null;
  lookupTableorder?: string | null;
  moveDlg?: 'F' | 'T';
  options?: string | null;
  paramVisible?: 'F' | 'T';
  readonly?: 'F' | 'T';
  required?: 'F' | 'T';
  titleHint?: string | null;
  validClass?: string | null;
  meta?: IMeta;
  dbTypeName?: string;
}

export interface IMeta {
  dbType: number;
  dbTypeName: string;
  fetchType: number;
  name: string;
  nullable: boolean;
  precision?: number;
  scale?: number;
  byteSize?: number;
}

export interface IControlBase {
  value?: any;
  defaultValue?: any;
  key: string;
  label?: string;
  required?: boolean;
  order: number;
  controlType: string;
  controlNumber?: number;
  type?: string;
  options?: IDescParam;
}

/********************
 * 0.0 Edit
 * 1.0 Date
 * 2.0 Combo
 * 3.0 LookupCombo (tab NCI)
 * 4.0 Memo
 * 5.0 DateTime
 * 6.0 SpinEdit
 * 7.0 RadioGroup
 * 8.0 ImageIndex
 * 9.0 Boolean
 * 10.0 RadioButton
 * 13.0 MultiEdit
 * 11.0 Group
 *
 *
 * const controls = {
 *   '0.0': UiInput,
 *   '1.0': UiDate, ///<h6>inputDate {data}</h6>,
 *   '2.0': UiSimpleSelect,
 *   '3.0': UiSelect, ///<h6>select {data}</h6>,
 *   //'5.0': InputDateControl,
 *   // '6.0': UiNumber,
 *   '6.0': UiNumber,
 *   '7.0': UiRadioGroup, ///<h6>radioButton {data}</h6>,
 *   '10.0': UiRadioMixedGroup,
 *   //'11.0': UiRadioButton,
 *   '13.0': UiTextarea, ///<h6>inputList {data}</h6>,
 * };
 */

export enum ControlType {
  'textBox' = 0,
  'dateBox' = 1,
  'selectBox' = 3,
  'areaBox' = 13,
  'numberBox' = 6,
  'undefBox' = -1,
  'simpleSelectBox' = 2,
  'radioGroup' = 7,
}

export enum ContextMenuAction {
  'Copy',
  'History',
  'ExportExel',
  'Filter',
  'FilterOff',
}

export interface JWTPayload {
  iat: number;
  owner: string;
  roles: string[];
  user: string;
}
