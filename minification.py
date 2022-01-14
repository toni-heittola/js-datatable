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
#from IPython import embed
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
    print("JS and CSS minification")
    print("-----------------------")

    minify_css_directory2(source='css', target='css.min')

    bundle_order = [
        'bootstrap-table.min.js',
        'bootstrap-table-filter-control.min.js',
        'Chart.bundle.min.js',
        'moment.min.js',
        'js-yaml.min.js',
        'datatable.min.js'
    ]

    minify_js_directory(source='js', target='js.min', bundle_order=bundle_order)


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
                    print(" " + current_file_path)
                    with open(current_file_path) as css_file:
                        with open(os.path.join(target, current_file.replace('.css', '.min.css')), "w") as minified_file:
                            minified_file.write(compress(css_file.read()))

def minify_css_directory2(source, target):
    """
    Move CSS resources from source directory to target directory and minify. Using rcssmin.

    """
    import rcssmin

    if os.path.isdir(source):
        print('CSS processing')
        if not os.path.exists(target):
            os.makedirs(target)

        for root, dirs, files in os.walk(source):
            for current_file in files:
                if current_file.endswith(".css"):
                    current_file_path = os.path.join(root, current_file)
                    print("[MINIFY]  " + current_file_path)
                    with open(current_file_path) as css_file:
                        with open(os.path.join(target, current_file.replace('.css', '.min.css')), "w") as minified_file:
                            minified_file.write(rcssmin.cssmin(css_file.read(), keep_bang_comments=True))

        bundle_data = []
        for root, dirs, files in os.walk(target):
            for current_file in files:
                if current_file.endswith(".css") and current_file !=  'datatable.bundle.min.css':
                    current_file_path = os.path.join(root, current_file)
                    css_file = open(current_file_path, "r")
                    bundle_data += css_file.readlines()
                    css_file.close()

        bundle_filename = os.path.join(target, 'datatable.bundle.min.css')
        bundle_file = open(bundle_filename, 'w+')
        bundle_file.write(''.join(bundle_data))
        bundle_file.close()

        print("[BUNDLE]  " + bundle_filename)
        print(" ")

def minify_js_directory(source, target, bundle_order=None):
    """
    Move JS resources from source directory to target directory and minify.

    """
    from jsmin import jsmin

    if os.path.isdir(source):
        print('JS minification')
        if not os.path.exists(target):
            os.makedirs(target)

        for root, dirs, files in os.walk(source):
            for current_file in files:
                if current_file.endswith(".js"):
                    current_file_path = os.path.join(root, current_file)
                    print("[MINIFY]  " + current_file_path)
                    with open(current_file_path) as js_file:
                        with open(os.path.join(target, current_file.replace('.js', '.min.js')), "w") as minified_file:
                            minified_file.write(jsmin(js_file.read()))

        print('JS bundle')
        bundle_data = []
        if bundle_order:
            bundle_order_ = []
            for item in bundle_order:
                bundle_order_.append(
                    os.path.join(target,item)
                )

            for current_file in bundle_order:
                current_file_path = os.path.join(target, current_file)
                print("[BUNDLE]  " + current_file_path)

                js_file = open(current_file_path, "r")
                bundle_data += js_file.readlines()
                js_file.close()

        else:
            for root, dirs, files in os.walk(target):
                for current_file in files:
                    if current_file.endswith(".js") and current_file !=  'datatable.bundle.min.js':
                        current_file_path = os.path.join(root, current_file)
                        print("[BUNDLE]  " + current_file_path)

                        js_file = open(current_file_path, "r")
                        bundle_data += js_file.readlines()
                        js_file.close()

        bundle_filename = os.path.join(target, 'datatable.bundle.min.js')
        bundle_file = open(bundle_filename, 'w+')
        bundle_file.write(''.join(bundle_data))
        bundle_file.close()

        print("[WRITE]   " + bundle_filename)
        print(" ")

if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv))
    except (ValueError, IOError) as e:
        sys.exit(e)