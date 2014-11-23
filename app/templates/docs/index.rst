.. <%= projectName %> documentation master file, created by
   sphinx-quickstart on Fri Nov  7 14:21:19 2014.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.
<% if (travis) { %>
|build-status| |coverage-status|<% } %>

Welcome to <%= projectName %> documentation!
====

<%= about %>

:License: MIT
:Requirements: Python <%= py_vers.join(', ') %>
:Version: 0.0.0

Contents:

.. toctree::
   :maxdepth: 2


Indexes and Tables
====

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
<% if (travis) { %>
.. |build-status| image:: https://travis-ci.org/<%= logins.travis %>/<%= projectName %>.svg?branch=master
   :target: https://travis-ci.org/<%= logins.travis %>/<%= projectName %>
   :alt: Build status
.. |coverage-status| image:: https://img.shields.io/coveralls/<%= logins.caverals %>/<%= projectName %>.svg
   :target: https://coveralls.io/r/<%= logins.coveralls %>/<%= projectName %>
   :alt: Test coverage percentage<% } %>
