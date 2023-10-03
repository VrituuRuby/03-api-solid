export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Email is already in use')
  }
}
