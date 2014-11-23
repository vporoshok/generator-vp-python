#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup
from pip.req import parse_requirements


README = open('README.rst').read()
CHANGELOG = open('docs/changelog.rst').read()
REQUIREMENTS = [str(req.req) for req in parse_requirements('requirements.txt')]


setup(
    name='<%= projectName %>',
    version='0.0.0',
    url='http://<%= projectName.toLowerCase() %>.readthedocs.org',
    author='<%= author %>',
    author_email='<%= email %>',
    description=README,
    long_description=README + '\n' + CHANGELOG,
    packages=['<%= projectName %>'],
    include_package_data=True,
    install_requires=REQUIREMENTS,
    classifiers=[
        'Development Status :: 1 - Planning',
        'Environment :: Console',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',  # <% if (_.contains(py_vers, '2.7')) { %>
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',  # <% } if (_.contains(py_vers, '3.4')) { %>
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',  # <% } if (_.contains(py_vers, 'PyPy')) { %>
        'Programming Language :: Python :: Implementation :: PyPy',  # <% } %>
        'Natural Language :: Russian',
        # 'https://pypi.python.org/pypi?%3Aaction=list_classifiers'
    ],
    test_suite='tests',
)
