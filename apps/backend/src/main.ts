import { runCronTask } from './cron';
import { startServer } from './server';

const command = process.argv[2];

if (command?.startsWith('cron:')) {
  const cronTask = command.slice('cron:'.length);

  await runCronTask(cronTask);
} else {
  startServer();
}
