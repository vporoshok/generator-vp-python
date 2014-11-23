<%= projectName %><% if (travis) { %> |build-status| |coverage-status|<% } if (sphinx) { %> |docs| <% } %>
====

<%= about %>

:License: MIT
:Requirements: Python <%= py_vers.join(', ') %>
:Version: 0.0.0
<% if (travis) { %>
.. |build-status| image:: https://travis-ci.org/<%= logins.travis %>/<%= projectName %>.svg?branch=master
   :target: https://travis-ci.org/<%= logins.travis %>/<%= projectName %>
   :alt: Build status
.. |coverage-status| image:: https://img.shields.io/coveralls/<%= logins.caverals %>/<%= projectName %>.svg
   :target: https://coveralls.io/r/<%= logins.coveralls %>/<%= projectName %>
   :alt: Test coverage percentage<% } if (sphinx) { %>
.. |docs| image:: https://readthedocs.org/projects/<%= projectName %>/badge/?version=latest
   :target: http://<%= projectName %>.readthedocs.org/
   :alt: Documentation<% } %>
