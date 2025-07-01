export  type ProjectModelProps = {
  projectName: string;
  projectCoverImage: string;
  projectImages: string;
  projectDescription: string;
  projectLink: string | null;
  projectGithub: string | null;
  projectType: string | null;
};

class ProjectModel {
  projectName: string;
  projectCoverImage: string;
  projectImages: string;
  projectDescription: string;
  projectLink: string | null;
  projectGithub: string | null;
  projectType: string | null;

  constructor({
    projectCoverImage,
    projectName,
    projectImages: projectImage,
    projectDescription,
    projectLink,
    projectGithub,
    projectType,
  }: ProjectModelProps) {
    this.projectName = projectName;
    this.projectImages = projectImage;
    this.projectDescription = projectDescription;
    this.projectLink = projectLink;
    this.projectGithub = projectGithub;
    this.projectType = projectType;
    this.projectCoverImage = projectCoverImage;
  }
/*************  ✨ Windsurf Command ⭐  *************/
  
  /**
   * Returns a JSON representation of the ProjectModel object
   * @returns {ProjectModelProps}
   */
  toJson(): ProjectModelProps {
    return {
      projectName: this.projectName,
      projectCoverImage: this.projectCoverImage,
      projectImages: this.projectImages,
      projectDescription: this.projectDescription,
      projectLink: this.projectLink,
      projectGithub: this.projectGithub,
      projectType: this.projectType,
    };
  }
/*******  03b28500-705f-4cf3-b9c8-644e191ad0d8  *******/
}

export default ProjectModel;
