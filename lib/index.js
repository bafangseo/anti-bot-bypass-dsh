import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export const name = 'anti-bot-bypass-dsh';
export const PACKAGE_NAME = '@ww15799927711/anti-bot-bypass-dsh';

export function resolveAntiBotBypassSkillRoot(profileBaseUrl) {
  if (!profileBaseUrl) {
    throw new Error('anti-bot-bypass-dsh: missing DSH profile baseUrl for package resolution');
  }
  let manifestPath;
  try {
    manifestPath = createRequire(profileBaseUrl).resolve(`${PACKAGE_NAME}/package.json`);
  } catch (error) {
    throw new Error(
      `anti-bot-bypass-dsh: cannot resolve ${PACKAGE_NAME}/package.json from the DSH profile`,
      { cause: error },
    );
  }
  return join(dirname(manifestPath), 'skills');
}
