export interface User {
  email: string;
  username: string;
  imageUrl: string;
  profileImage?: string;
}

export interface loginResponce {
  userId: string;
  token: string;
  userEmail: string;
  userName: string;
  userProfileImage: string;
}
