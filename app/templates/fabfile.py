#!/usr/bin/env
# -*- coding: utf-8 -*-

# from fabric.api import task, local

import docs

try:
    from gntp.notifier import mini as note

except ImportError:
    def note(*args):
        pass

__all__ = [
    'docs'
]
