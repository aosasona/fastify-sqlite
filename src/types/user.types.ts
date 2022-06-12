interface UserInterface {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
}

// Users Registration Route Interface
interface RegRoute {
  Body: UserInterface;
  Headers: any;
}

export { UserInterface, RegRoute };
