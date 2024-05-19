export class APIError extends Error {
    public status: number
    public message: string
    public source :string
    constructor(status: number, message: string,source:string) {
      super(message)
      this.status = status
      this.message = message
      this.source=source
    }
  }