#!/usr/bin/env
# -*- coding: utf-8 -*-

from fabric.api import task, local, lcd

try:
    from gntp.notifier import mini as note

except ImportError:
    def note(*args):
        pass

OPTIONS = {
    'sphinx': 'sphinx-build',
    'sphinx-opts': '',
    'paper': '',
    'apidoc': 'sphinx-apidoc',
    'builddir': '_build',
    'package': 'simplegraph'
}
OPTIONS['sphinx-all'] = '-d {builddir}/doctrees {sphinx-opts} .'\
                        .format(**OPTIONS)

PWD = 'docs'


@task
def clear():
    with lcd(PWD):
        local('rm -rf {builddir}'.format(**OPTIONS))


@task
def apidoc():
    local('{apidoc} -f -o docs/api {package}'.format(**OPTIONS))


@task
def html():
    with lcd(PWD):
        local('{sphinx} -b html {sphinx-all} {builddir}/html'
              .format(**OPTIONS))


@task
def open():
    with lcd(PWD):
        local('open {builddir}/html/index.html'.format(**OPTIONS))


@task(default=True)
def default():
    apidoc()
    html()
    note('Docs has builded')
