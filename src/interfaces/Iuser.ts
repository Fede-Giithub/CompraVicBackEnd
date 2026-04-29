interface IUser {
  email: string,
  password: string,
  role: "user" | "admin"
}

export default IUser