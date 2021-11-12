const systemRoleTransformation = (role) => {
  switch (role) {
    case 'MANAGER':
    case 'Manager':
      return 'Manager';
    case 'NORMAL':
    case 'Normal':
      return 'Normal';
    case 'GUEST':
    case 'Guest':
      return 'Guest';
    default:
      return 'Unknown';
  }
};
export default systemRoleTransformation;
