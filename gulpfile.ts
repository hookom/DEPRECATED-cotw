import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';

import Config from './tools/config';
import { loadTasks, loadCompositeTasks } from './tools/utils';


loadTasks(Config.SEED_TASKS_DIR);
loadTasks(Config.PROJECT_TASKS_DIR);

loadCompositeTasks(Config.SEED_COMPOSITE_TASKS, Config.PROJECT_COMPOSITE_TASKS);


// --------------
// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done: any) => {
  if (firstRun) {
    firstRun = false;
    runSequence('check.tools', 'clean.dev', 'clean.coverage', done);
  } else {
    util.log('Skipping clean on rebuild');
    done();
  }
});

// Build dev.
gulp.task('build.dev', done =>
runSequence('clean.dev',
            'tslint',
            'build.assets.dev',
            'build.fonts',    // Added task;
            'build.js.dev',
            'build.index.dev',
            done));
// Build prod.
gulp.task('build.prod', done =>
runSequence('clean.prod',
            'tslint',
            'build.assets.prod',
            'build.fonts',    // Added task;
            'build.html_css.prod',
            'build.js.prod',
            'build.bundles',
            'build.bundles.app',
            'build.index.prod',
            done));
// Build test.
gulp.task('build.test', done =>
runSequence('clean.dev',
            'tslint',
            'build.assets.dev',
            'build.fonts',    // Added task;
            'build.js.test',
            'build.index.dev',
            done));
