var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var tsify       = require('tsify');

var targetPath  = 'build';
var entries_main     = [
    'src/front/main.ts'
];
var entries_logic     = [
    'src/logic/index.ts'
];
var entries_logic_webgl     = [
    'src/logic_webgl/index.ts'
];

var entries_html     = [
    'src/boot/index.html'
];

var entries_default = [
    'src/boot/index.ts'
]

var entries_babylon = [
    'src/lib/babylon/babylon.max.js',
    'src/lib/babylon/babylon.gui.js'
]

var entries_pep = [
    'src/lib/pep/pep.js'
]

function gulp_html() {
    gulp.task(
        'copy-html',
        function() {
            return gulp.src(entries_html)
                .pipe(gulp.dest(`./build/boot`));
        }
    );
}

function gulp_lib() {
    gulp.task(
        'copy-lib-babylon',
        function() {
            return gulp.src(entries_babylon)
                .pipe(gulp.dest(`./build/lib/babylon`));
        }
    );

    gulp.task(
        'copy-lib-pep',
        function() {
            return gulp.src(entries_pep)
                .pipe(gulp.dest(`./build/lib/pep`));
        }
    );
    
    gulp.task(
        'copy-lib',
        gulp.series(['copy-lib-babylon', 'copy-lib-pep'])
    );
}

function gulp_bundle_logic() {
    gulp.task(
        'bundle_logic',
        function () {
            return browserify({
                basedir: '.',
                debug: true,
                entries: entries_logic,
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source('index.js'))
            .pipe(gulp.dest(`./build/logic`))
        }
    );
}

function gulp_bundle_logic_webgl() {
    gulp.task(
        'bundle_logic_webgl',
        function () {
            return browserify({
                basedir: '.',
                debug: true,
                entries: entries_logic_webgl,
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source('index.js'))
            .pipe(gulp.dest(`./build/logic_webgl`))
        }
    );
}

function gulp_bundle_front() {
    gulp.task(
        'bundle_front',
        function () {
            return browserify({
                basedir: '.',
                debug: true,
                entries: entries_main,
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(`./build/front`))
        }
    );
}

function gulp_bundle_front() {
    gulp.task(
        'default',
        function () {
            return browserify({
                basedir: '.',
                debug: true,
                entries: entries_default,
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .bundle()
            .pipe(source('index.js'))
            .pipe(gulp.dest(`./build/boot`))
        }
    );
}

//
const init = () => {
    gulp_lib();
    gulp_html();
    gulp_bundle_front();
    gulp_bundle_logic();
    gulp_bundle_logic_webgl();
}

// ======================================
exports.init = init;