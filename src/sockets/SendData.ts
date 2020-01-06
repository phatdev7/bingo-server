class SendData {
  cmd: string;
  params: {
    [key: string]: any;
    error: string;
  };
  constructor(cmd: string) {
    this.cmd = cmd;
    this.params = {
      error: '',
    };
  }

  getCmd = () => {
    return this.cmd;
  };

  setCmd = (cmd: string) => {
    this.cmd = cmd;
  };

  getParams = () => {
    return this.params;
  };

  addParam = (key: string, value: any) => {
    this.params[key] = value;
    return this;
  };

  addParams = (params: object) => {
    this.params = { ...this.params, ...params };
  };

  setError = (err: string) => {
    this.params.error = err;
  };
}

export default SendData;
