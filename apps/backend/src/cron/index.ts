const workers: Record<string, () => Promise<{ default: { scheduled(): Promise<void> | void } }>> = {
  'delete-expired-invitations': () => import('./delete-expired-invitations')
};

export async function runCronTask(task: string): Promise<void> {
  const load = workers[task];

  if (!load) {
    const available = Object.keys(workers).join(', ');

    throw new Error(`Unknown cron task: "${task}". Available: ${available}`);
  }

  console.log(`Running cron task: ${task}`);

  const { default: worker } = await load();

  await worker.scheduled();

  console.log(`Cron task completed: ${task}`);
}
