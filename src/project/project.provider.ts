import Project from './project.entity';

export const projectProvider = {
	provide: 'ProjectRepository',
	useValue: Project,
};
