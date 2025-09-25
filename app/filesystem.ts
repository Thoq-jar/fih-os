export interface File {
  name: string;
  content: string;
}

export interface Directory {
  name: string;
  children: (File | Directory)[];
}

export const filesystem: Directory = {
  name: '~',
  children: [],
};
