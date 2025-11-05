import 'dotenv/config';
import cron from 'node-cron';
import dbConnect from '../db';
import { runEsimUsageJob } from './jobs/airalo-jobs/esim-usage.job';

const CRON_SCHEDULE = '*/5 * * * *'; // Every 5 minutes

let isRunning = false;

async function runJobWithLock() {
	if (isRunning) {
		console.warn('[ESIM USAGE] Previous run still in progress, skipping');
		return;
	}

	isRunning = true;
	try {
		await runEsimUsageJob();
	} catch (error) {
		console.error('[ESIM USAGE] Job failed', error);
	} finally {
		isRunning = false;
	}
}

async function bootstrap() {
	await dbConnect.authenticate();
	console.log('[ESIM USAGE] Worker connected to database');

	const task = cron.schedule(CRON_SCHEDULE, () => {
		void runJobWithLock();
	});

	task.start();

	if (process.env.USAGE_POLL_RUN_ON_BOOT !== 'false') {
		await runJobWithLock();
	}
}

bootstrap().catch((error) => {
	console.error('[ESIM USAGE] Worker bootstrap failed', error);
	process.exit(1);
});
