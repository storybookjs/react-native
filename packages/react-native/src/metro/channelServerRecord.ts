import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * What a running channel server writes so `sb-rn` can find it without guessing ports. It lives in
 * the project's node_modules cache, keyed by the directory the bundler was started from.
 */
export interface ChannelServerRecord {
  schemaVersion: 1;
  pid: number;
  /** Base URL for HTTP requests, e.g. http://localhost:7007 */
  url: string;
  port: number;
  host?: string;
  secured: boolean;
  websockets: boolean;
  mcp: boolean;
  configPath: string;
  cwd: string;
  startedAt: string;
}

export function getChannelServerRecordPath(cwd: string) {
  return path.join(cwd, 'node_modules', '.cache', 'storybook-react-native', 'channel-server.json');
}

function isProcessAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means the process exists but belongs to another user.
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

/**
 * Writes the record of this process's channel server and returns a function that removes it. The
 * record is also removed when the process exits.
 */
export function writeChannelServerRecord(
  record: Omit<ChannelServerRecord, 'schemaVersion' | 'pid' | 'cwd' | 'startedAt'>
): () => void {
  const cwd = process.cwd();
  const recordPath = getChannelServerRecordPath(cwd);

  try {
    mkdirSync(path.dirname(recordPath), { recursive: true });
    writeFileSync(
      recordPath,
      JSON.stringify(
        {
          schemaVersion: 1,
          pid: process.pid,
          cwd,
          startedAt: new Date().toISOString(),
          ...record,
        } satisfies ChannelServerRecord,
        null,
        2
      )
    );
  } catch {
    // Discovery is a convenience; the server works without the record.
    return () => {};
  }

  const removeRecord = () => {
    process.off('exit', removeRecord);

    try {
      const current = JSON.parse(readFileSync(recordPath, 'utf-8')) as ChannelServerRecord;

      if (current.pid === process.pid && current.port === record.port) {
        unlinkSync(recordPath);
      }
    } catch {
      // Already gone or replaced by another server.
    }
  };

  process.once('exit', removeRecord);

  return removeRecord;
}

/** Returns the record of a channel server started from `cwd`, if its process is still running. */
export function readChannelServerRecord(cwd: string): ChannelServerRecord | undefined {
  try {
    const record = JSON.parse(
      readFileSync(getChannelServerRecordPath(cwd), 'utf-8')
    ) as ChannelServerRecord;

    return record.schemaVersion === 1 && isProcessAlive(record.pid) ? record : undefined;
  } catch {
    return undefined;
  }
}
