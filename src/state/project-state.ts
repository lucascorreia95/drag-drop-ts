import { Project, ProjectStatus } from '../models/project';

// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListeners(listenersFn: Listener<T>) {
    this.listeners.push(listenersFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instace: ProjectState;

  private constructor() {
    super();
  }

  static getInstace() {
    if(this.instace) {
      return this.instace;
    }
    this.instace = new ProjectState();
    return this.instace;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(prj => prj.id === projectId);
    if(project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  updateListeners() {
    for (const listenersFn of this.listeners) {
      listenersFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstace();
