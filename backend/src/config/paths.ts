export const paths = {
  entities: {
    user: 'src/users/entities/user.entity',
    // Add other entity paths here as needed
  },
  modules: {
    users: 'src/users/users.module',
    auth: 'src/auth/auth.module',
  },
  strategies: {
    jwt: 'src/auth/strategies/jwt.strategy',
    local: 'src/auth/strategies/local.strategy',
  },
  // Add other path groups as needed
} as const;
