type ContactInfoParameters = {
  logoImage: string | null;   
  label: string;
  link: string | null;
  type: string;
};

class ContactInfo {
  logoImage: string | null;
  label: string;
  link: string | null;
  type: string;

  constructor({ logoImage, label, link, type }: ContactInfoParameters) {
    this.logoImage = logoImage;
    this.label = label;
    this.link = link;
    this.type = type;
  }
}
export default ContactInfo