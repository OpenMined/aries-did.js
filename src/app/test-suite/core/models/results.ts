export interface IResult {
  module?: string;
  name: string;
  pass: boolean;
}

export class Results {
  private _results: IResult[] = [];
  private _module: string;

  addResults(result: IResult) {
    this._results.push({ ...result, module: this._module });
  }

  get results() {
    return this._results;
  }
  constructor(module: string) {
    this._module = module;
  }
}
