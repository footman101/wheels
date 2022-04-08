class Token {
  static EOL = '\\N';
  static EOF = new Token(-1);

  private lineNumber: number;

  protected constructor(lineNumber: number) {
    this.lineNumber = lineNumber;
  }

  public getLineNumber() {
    return this.lineNumber;
  }

  public isIdentifier() {
    return false;
  }

  public isNumber() {
    return false;
  }

  public isString() {
    return false;
  }
}

export default Token;
