# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
import logging
import sys

from flask import Flask, redirect

from . import benchmarks, users
from .extensions import api  # Api interface module
from .extensions import bcrypt  # Encrypt passwords and others
from .extensions import cache  # Caches responses
from .extensions import db  # SQLAlchemy instance
from .extensions import migrate  # Alembic ext. manage db migrations


def create_app(config_object="eosc_perf.settings.Configuration"):
    """Create application factory, as explained here: 
    http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split(".")[0])
    app.config.from_object(config_object)
    register_extensions(app)
    register_blueprints(app)
    configure_logger(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    api.init_app(app)
    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)


def register_blueprints(app):
    """Register Flask blueprints."""
    api.register_blueprint(benchmarks.blueprint, url_prefix='/benchmarks')
    api.register_blueprint(users.blueprint, url_prefix='/users')


def configure_logger(app):
    """Configure loggers."""
    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)
