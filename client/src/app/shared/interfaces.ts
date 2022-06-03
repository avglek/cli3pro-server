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
  isLoading?: string;
  data?: any;
}
