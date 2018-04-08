
// Set user info from request
export function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    userName: request.userName,
    password: request.password,
    industryName:request.industryName
    
  };

  return getUserInfo;
};
