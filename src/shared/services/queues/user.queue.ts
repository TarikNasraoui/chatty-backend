import { BaseQueue } from '@service/queues/base.queue';
import { userWorker } from '@worker/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }
  public addUserJob(name: string, data: any) {
    this.addJob(name, data);
  }
}
export const userQueue: UserQueue = new UserQueue();
