'use strict';
var fs = require('fs');
var ini = require('ini');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var GitHubAPI = require('github');
var BitBucket = require('bitbucket-rest');

var isChecked = function (key, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === key) return true;
    }
    return false;
}

var VpPythonGenerator = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.option('git', {
            desc: 'Init git repository, use --no-git to disable.',
            type: Boolean,
            defaults: true
        });

        var config = {}
        var ini_file = path.join(process.env.HOME, '.about.me')
        try {
            config = ini.parse(fs.readFileSync(ini_file, 'utf-8'));
        } catch(e) {
            throw e;
        }

        this.author = config.me || '';
        this.email = config.email || '';

        this.logins = config.logins || {};

        this.gh_login = config.logins ? config.logins.github || '' : '';
        this.gh_pass = config.passwords ? config.passwords.github || '' : '';

        this.gh_token = config.tokens ? config.tokens.github || '' : '';

        this.bb_login = config.logins ? config.logins.bitbucket || '' : '';
        this.bb_pass = config.passwords ? config.passwords.bitbucket || '' : '';
    },

    initializing: function () {
        this.pkg = require(path.join('..', 'package.json'));
    },

    prompting: function () {
        var done = this.async();
        var gen = this;

        // Have Yeoman greet the user.
        this.log(yosay(
          'Welcome to the funkadelic VpPython generator!'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'What is the project name?'
            }, {
                type: 'input',
                name: 'about',
                message: 'Please, enter some description:'
            }, {
                when: function () {
                    return !gen.author;
                },
                type: 'input',
                name: 'author',
                message: 'Please, enter you name:'
            }, {
                when: function () {
                    return !gen.email;
                },
                type: 'input',
                name: 'email',
                message: 'Please, enter you email:'
            }, {
                when: function () {
                    return gen.options.git;
                },
                type: 'list',
                name: 'repo',
                message: 'Where repository will be stored?',
                choices: [
                    'github',
                    'bitbucket',
                    'other'
                ],
                default: 0
            }, {
                when: function (props) {
                    return props.repo === 'github' && !gen.gh_login && !gen.gh_token;
                },
                type: 'input',
                name: 'gh_login',
                message: 'What is you github login?'
            }, {
                when: function (props) {
                    return props.repo === 'github' && !gen.gh_pass && !gen.gh_token;
                },
                type: 'password',
                name: 'gh_pass',
                message: 'What is you bitbucket password?'
            }, {
                when: function (props) {
                    return props.repo === 'bitbucket' && !gen.bb_login;
                },
                type: 'input',
                name: 'bb_login',
                message: 'What is you bitbucket login?'
            }, {
                when: function (props) {
                    return props.repo === 'bitbucket' && !gen.bb_pass;
                },
                type: 'password',
                name: 'bb_pass',
                message: 'What is you bitbucket password?'
            }, {
                when: function (props) {
                    return props.repo === 'bitbucket';
                },
                type: 'input',
                name: 'bb_owner',
                message: 'What is you bitbucket owner? (' + gen.bb_login + ')'
            }, {
                type: 'checkbox',
                name: 'options',
                message: 'What additional options?',
                choices: [
                    'setup.py',
                    'TravisCI',
                    'Sphinx'
                ],
                default: [
                    'setup.py',
                    'TravisCI',
                    'Sphinx'
                ]
            }, {
                type: 'checkbox',
                name: 'py_vers',
                message: 'What python version provides?',
                choices: [
                    '2.7',
                    '3.4',
                    'PyPy'
                ],
                default: [
                    '2.7',
                    '3.4',
                    'PyPy'
                ]
            }
        ];

        this.prompt(prompts, function (props) {
            this.projectName = this._.slugify(props.projectName);
            this.about = props.about;

            this.author = props.author || this.author;
            this.email = props.email || this.email;

            this.repo = props.repo;
            this.gh_login = props.gh_login || this.gh_login;
            this.gh_pass = props.gh_pass || this.gh_pass;

            this.gh_token = props.gh_token || this.gh_token;

            this.bb_login = props.bb_login || this.bb_login;
            this.bb_pass = props.bb_pass || this.bb_pass;
            this.bb_owner = props.bb_owner || this.bb_login;

            this.setup = isChecked('setup.py', props.options);
            this.travis = isChecked('TravisCI', props.options);
            this.sphinx = isChecked('Sphinx', props.options);

            this.py_vers = props.py_vers;

            done();
        }.bind(this));
    },

    configuring: function () {
        if (!this.options.git) {
            return;
        }
        var git = this.spawnCommand('git', ['init']);
        var gen = this;
        git.on('close', function (code) {
            if (code) {
                throw new Error(code);
            }
            if (gen.repo === 'github') {
                var github = new GitHubAPI({
                    version: "3.0.0"
                });

                if (gen.gh_token) {
                    github.authenticate({
                        type: 'oauth',
                        token: gen.gh_token
                    });
                } else {
                    github.authenticate({
                        type: 'basic',
                        username: gen.gh_login,
                        password: gen.gh_pass
                    });
                }
                github.repos.create({
                    name: gen.projectName,
                    description: gen.about
                }, function (err, res) {
                    if (err) {
                        throw new Error(err);
                    }
                    gen.spawnCommand('git', ['remote', 'add', 'origin', res.ssh_url]);
                });
            } else if (gen.repo === 'bitbucket') {
                var bitbucket = BitBucket.connectClient({
                    username: gen.bb_login,
                    password: gen.bb_pass
                });
                bitbucket.createRepo({
                    owner: gen.bb_owner,
                    repo_slug: gen.projectName,
                    description: gen.about,
                    is_private: true
                }, function (res) {
                    if (res.status !== 200) {
                        throw new Error(res.error);
                    }
                    var ssh_url = 'git@bitbucket.org:' + gen.bb_owner + '/' + gen.projectName + '.git'
                    gen.spawnCommand('git', ['remote', 'add', 'origin', ssh_url]);
                });
            }

            gen.spawnCommand('git', ['checkout', '-b', 'devel']);
        });
    },

    writing: {
        app: function () {
            this.dest.mkdir(this.projectName);

            this.template('.bumpversion.cfg', '.bumpversion.cfg');
            this.template('.gitignore', '.gitignore');
            this.template('fabfile.py', 'fabfile.py');
            this.template('LICENSE', 'LICENSE');
            this.template('readme.rst', 'readme.rst');
            this.template('requirements.txt', 'requirements.txt');
            this.template('tox.ini', 'tox.ini');
            this.template(path.join('docs', 'changelog.rst'),
                          path.join('docs', 'changelog.rst'));
            this.template('__init__.py',
                          path.join(this.projectName, '__init__.py'));

            if (this.setup) {
                this.dest.mkdir('tests');
                this.template('setup.py', 'setup.py');
                this.template('MANIFEST.in', 'MANIFEST.in');
            } else {
                this.dest.mkdir(path.join(this.projectName, 'tests'));
            }

            if (this.sphinx) {
                this.template(path.join('docs', '__init__.py'),
                              path.join('docs', '__init__.py'));
                this.template(path.join('docs', 'conf.py'),
                              path.join('docs', 'conf.py'));
                this.template(path.join('docs', 'index.rst'),
                              path.join('docs', 'index.rst'));
                this.template(path.join('docs', 'requirements.txt'),
                              path.join('docs', 'requirements.txt'));
            }

            if (this.travis) {
                this.template('.travis.yml', '.travis.yml');
            }
        }
    },

    end: function () {
        // this.installDependencies();
    }
});

module.exports = VpPythonGenerator;
