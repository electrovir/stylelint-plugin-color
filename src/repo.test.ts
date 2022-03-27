import {removeColor} from 'augment-vir';
import {runShellCommand} from 'augment-vir/dist/node-only';
import {dirname, join} from 'path';

const repoRootDir = dirname(__dirname);
const testReposDir = join(repoRootDir, 'test-repos');
const testRepos = {
    shouldFail: join(testReposDir, 'should-fail'),
    shouldPass: join(testReposDir, 'should-pass'),
} as const;

describe('test repos', () => {
    const stylelintCommand = `npx stylelint *.css`;

    it('should fail', async () => {
        const commandResult = await runShellCommand(stylelintCommand, {
            cwd: testRepos.shouldFail,
        });

        expect(commandResult.error).toBeDefined();
        expect(commandResult.exitCode).not.toBe(0);
        expect(commandResult.stderr).toBe('');
        expect(removeColor(commandResult.stdout).trim()).toBe(`index.css
 2:5  ✖  Color definitions of type [named, hex] are blocked: \"border: blue #000\"  plugin-color/color-types`);
    });
    it('should pass', async () => {
        const commandResult = await runShellCommand(stylelintCommand, {
            cwd: testRepos.shouldPass,
        });

        expect(commandResult.error).toBeUndefined();
        expect(commandResult.exitCode).toBe(0);
        expect(commandResult.stderr).toBe('');
        expect(commandResult.stdout).toBe('');
    });
});
