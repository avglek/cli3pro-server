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
  children?: ITreeNode[];
}

export interface ITreeDocs {
  docId: number;
  docName: string;
  imgIndex: number;
  ordering: number;
  parentId: number;
  prognoz: number | null;
}

export interface ITabData {
  uid?: string;
  docId?: number;
  title?: string;
  isLoading?: boolean;
  data?: any;
}

export interface IDesc {
  id: number;
  description: IDescDescription;
  procName: string;
  form: 'Y' | 'N';
  params: IDescParam[];
}

export interface IDescDescription {
  docId?: number;
  docName?: string;
  roleName?: string | null;
  isFolder?: 'F' | 'T';
  cmdText?: string | null;
  cmdType?: string | null;
  docClass?: string | null;
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
}
