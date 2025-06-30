export type UserModelParams = {
  name: string;
  email: string;
  hero: string;
  aboutMe: string;
  image: string;
  address: string;
};

class UserModel {
  name: string;
  email: string;
  hero: string;
  aboutMe: string;
  image: string;
  address: string;

  constructor({ name, email, hero, aboutMe, image, address }: UserModelParams) {
    this.name = name;
    this.email = email;
    this.hero = hero;
    this.aboutMe = aboutMe;
    this.image = image;
    this.address = address;
  }

  // 🔽 Add this method
  toJson(): UserModelParams {
    return {
      name: this.name,
      email: this.email,
      hero: this.hero,
      aboutMe: this.aboutMe,
      image: this.image,
      address: this.address,
    };
  }
}

export default UserModel;
