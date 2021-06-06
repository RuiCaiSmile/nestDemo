export interface signalData {
  id?: string;
  type: string;
  des: string;
}

export interface resData {
  code: number;
  des: string;
  result: 'success' | 'error';
}
