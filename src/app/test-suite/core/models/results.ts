export interface IResult {
  name: string;
  pass: boolean;
}

export class Results {
  private _results: IResult[] = [];

  addResults(result: IResult) {
    this._results.push(result);
  }

  get results() {
    return this._results;
  }
  constructor() {}
}
