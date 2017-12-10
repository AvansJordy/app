export class Ingredient {
  
  public id: string;
  public _name: string;
  public _amount : number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  public get _id(): string {
    return this.id;
  }

  public set _id(n: string) {
    this.id = n;
  }

  public get name(): string {
    return this._name;
  }

  public set name(n: string) {
    this._name = n;
  }

  public get amount(): number {
    return this._amount;
  }

  public set amount(n: number) {
    this._amount = n;
  }
}
