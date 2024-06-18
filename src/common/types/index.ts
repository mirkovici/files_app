export interface IPath {
  fileUrl: string;
}

export interface IData {
  [key: string]: IPath[];
}

export interface IDirectory {
  [key: string]: [];
}

export interface IRoot {
  items: IDirectory;
}

export interface IDirectoryChildren {
  name: string;
  children: [];
}
