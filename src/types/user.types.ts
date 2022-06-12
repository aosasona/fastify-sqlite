// Full body interface
interface UserInterface {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
  identifier?: string;
}

// Users Registration Route Interface
interface RegRoute {
  Body: UserInterface;
  Headers: any;
}

// Single user interface
interface SingleUserInterface {
  email?: string;
  password?: string;
}

// Token verification interface
interface TokenInterface {
  email: string;
  role?: string[];
  iat?: number;
  exp?: number;
}

export { UserInterface, SingleUserInterface, TokenInterface, RegRoute };
