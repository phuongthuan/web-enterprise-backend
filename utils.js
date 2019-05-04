function hasPermission(user, rolesNeeded) {
  const matchRoles = user.roles.filter(roleTheyHave =>
    rolesNeeded.includes(roleTheyHave)
  );
  if (!matchRoles.length) {
    throw new Error(`You do not have sufficient permissions
      : ${rolesNeeded}
      You Have:
      ${user.permissions}
      `);
  }
}

exports.hasPermission = hasPermission;