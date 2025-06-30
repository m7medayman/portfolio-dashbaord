type ProjectModelProps = {
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
}

export default ProjectModel;
