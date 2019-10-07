export interface IResult {
  module: string;
  name: string;
  pass: boolean;
}

export class Results {
  private _results: IResult[] = [];
  module: string;

  addResults(result: IResult) {
    this._results.push(result);
  }

  get results() {
    return this._results;
  }
  constructor(module: string) {
    this.module = module;
  }
}
