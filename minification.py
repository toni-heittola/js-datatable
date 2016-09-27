#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
JS and CSS minification
============================
Author: Toni Heittola (toni.heittola@gmail.com)

This plugin will create dynamic datatable with charting features from given yaml-datafile.

"""

import os
import sys
import io
import argparse
import textwrap
from IPython import embed
__version_info__ = ('0', '1', '0')
__version__ = '.'.join(__version_info__)


def main(argv):
    parser = argparse.ArgumentParser(
        prefix_chars='-+',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description=textwrap.dedent('''\
            JS and CSS minification
            ---------------------------------------------
                Author:  Toni Heittola ( toni.heittola@gmail.com )

        '''))
    parser.add_argument('-v', '--version', action='version', version='%(prog)s ' + __version__)
    args = parser.parse_args()
    print "JS and CSS minification"
    print "-----------------------"

    minify_css_directory2(source='css', target='css.min')
    minify_js_directory(source='js', target='js.min')


def minify_css_directory(source, target):
    """
    Move CSS resources from source directory to target directory and minify. Using csscompressor.

    """
    from csscompressor import compress

    if os.path.isdir(source):
        if not os.path.exists(target):
            os.makedirs(target)

        for root, dirs, files in os.walk(source):
            for current_file in files:
                if current_file.endswith(".css"):
                    current_file_path = os.path.join(root, current_file)
                    print " ", current_file_path
                    with open(current_file_path) as css_file:
                        with open(os.path.join(target, current_file.replace('.css', '.min.css')), "w") as minified_file:
                            minified_file.write(compress(css_file.read()))

def minify_css_directory2(source, target):
    """
    Move CSS resources from source directory to target directory and minify. Using rcssmin.

    """
    import rcssmin

    if os.path.isdir(source):
        if not os.path.exists(target):
            os.makedirs(target)

        for root, dirs, files in os.walk(source):
            for current_file in files:
                if current_file.endswith(".css"):
                    current_file_path = os.path.join(root, current_file)
                    print " ", current_file_path
                    with open(current_file_path) as css_file:
                        with open(os.path.join(target, current_file.replace('.css', '.min.css')), "w") as minified_file:
                            minified_file.write(rcssmin.cssmin(css_file.read(), keep_bang_comments=True))


def minify_js_directory(source, target):
    """
    Move JS resources from source directory to target directory and minify.

    """
    from jsmin import jsmin

    if os.path.isdir(source):
        if not os.path.exists(target):
            os.makedirs(target)

        for root, dirs, files in os.walk(source):
            for current_file in files:
                if current_file.endswith(".js"):
                    current_file_path = os.path.join(root, current_file)
                    print " ", current_file_path
                    with open(current_file_path) as js_file:
                        with open(os.path.join(target, current_file.replace('.js', '.min.js')), "w") as minified_file:
                            minified_file.write(jsmin(js_file.read()))

if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv))
    except (ValueError, IOError) as e:
        sys.exit(e)