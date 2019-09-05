const paramCheck = (users) => {
  let data = [];
  for (let i = 0; i < users.length; i++) {
    users.map((Newuser) => {
      data.push({

        id: Newuser.id,
        firstName: Newuser.firstName,
        lastName: Newuser.lastName,
        email: Newuser.email,
        address: Newuser.address,
        bio: Newuser.bio,
        occupation: Newuser.occupation,
        expertise: Newuser.expertise,
        type: Newuser.type,
      });
    });
  }
  return data;
};
export default paramCheck;
