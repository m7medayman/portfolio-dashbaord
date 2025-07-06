export  type ProjectModelProps = {
  projectName: string;
  projectCoverImage: string;
  projectImages: string;
  keywords: Array<string>;
  projectDescription: string;
  projectLink: string | null;
  projectGithub: string | null;
  projectType: string | null;
  id : string;
};

class ProjectModel {
  projectName: string;
  keywords: Array<string>;
  projectCoverImage: string;
  projectImages: string;
  projectDescription: string;
  projectLink: string | null;
  projectGithub: string | null;
  projectType: string | null;
  id : string;

  constructor({
    projectCoverImage,
    projectName,
    projectImages: projectImage,
    projectDescription,
    projectLink,
    projectGithub,
    keywords,
    projectType,
    id,
  }: ProjectModelProps) {
    this.keywords = keywords
    this.projectName = projectName;
    this.projectImages = projectImage;
    this.projectDescription = projectDescription;
    this.projectLink = projectLink;
    this.projectGithub = projectGithub;
    this.projectType = projectType;
    this.projectCoverImage = projectCoverImage;
    this.id = id
  }
/*************  ✨ Windsurf Command ⭐  *************/
  
  /**
   * Returns a JSON representation of the ProjectModel object
   * @returns {ProjectModelProps}
   */
  toJson(): ProjectModelProps {
    return {
      id: this.id,
      keywords: this.keywords,
      projectName: this.projectName,
      projectCoverImage: this.projectCoverImage,
      projectImages: this.projectImages,
      projectDescription: this.projectDescription,
      projectLink: this.projectLink,
      projectGithub: this.projectGithub,
      projectType: this.projectType,
    };
  }
}

export default ProjectModel;
