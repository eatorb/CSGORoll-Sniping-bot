import Dockerode from 'dockerode';
import {InstanceRepository} from "../repository/Instance.repository";
import {IInstance} from "../models/interfaces/IInstance";

export class InstanceService {

    private docker: Dockerode;
    private readonly imageName: string = 'snipeit-io-api';
    private instanceRepository: InstanceRepository;

    constructor() {
        this.docker = new Dockerode();
        this.instanceRepository = new InstanceRepository();
    }

    async createInstance(userId: number | undefined): Promise<void> {

        if (!userId)
            throw new Error('An unexpected error happened while trying to create an instance.');

        const instance: IInstance | null = await this.instanceRepository.getUserInstance(userId);

        if (instance)
            throw new Error('Instance already exists for this user.');


        const container: Dockerode.Container = await this.docker.createContainer({
            Image: this.imageName,
            Cmd: ['node', './dist/src/client/ClientInit.js'],
            name: `container_${userId}`
        });

        const containerInfo: Dockerode.ContainerInspectInfo = await container.inspect();

        await this.instanceRepository.insertInstance(userId, containerInfo.Id, containerInfo.State.Status);

        await container.start();

    }

    async startInstance(userId: number | undefined): Promise<void> {

        if (!userId)
            throw new Error('An unexpected error happened while trying to start an instance.');

        const instance: IInstance | null = await this.instanceRepository.getUserInstance(userId);

        if (!instance)
            throw new Error('There are no active instances on your account. Please create an instance first.');

        const container: Dockerode.Container = this.docker.getContainer(instance.containerId);

        await container.start();
    }

    async stopInstance(userId: number | undefined): Promise<void> {

        if (!userId)
            throw new Error('An unexpected error happened while trying to stop an instance.');

        const instance: IInstance | null = await this.instanceRepository.getUserInstance(userId);

        if (!instance)
            throw new Error('There are no active instances on your account. Please create an instance first.');


        const container: Dockerode.Container = this.docker.getContainer(instance.containerId);

        await container.stop();
    }

    async deleteInstance(userId: number | undefined): Promise<void> {

        if (!userId)
            throw new Error('An unexpected error happened while trying to start an instance.');

        const instance: IInstance | null = await this.instanceRepository.getUserInstance(userId);

        if (!instance)
            throw new Error('There are no active instances on your account. Please create an instance first.');

        const container: Dockerode.Container = this.docker.getContainer(instance.containerId);
        await container.remove();

        await this.instanceRepository.deleteInstance(userId, instance.containerId);
    }

    async listInstance(userId: number | undefined): Promise<IInstance | null> {
        if (!userId)
            throw new Error('An unexpected error happened while trying to list an instance.');

        return await this.instanceRepository.getUserInstance(userId);
    }
}